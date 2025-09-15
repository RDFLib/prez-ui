$upgradeComplete = (get-content "package.json" | where-object {$_ -like "*"tailwindcss": "^4*" }).length -gt 0 
if ($upgradeComplete){
    write-output "This theme has already been upgraded"
    return 
}
$usePnpm = test-path "pnpm-lock.yaml"

function invoke-npmcommand {
    param(
        [string]$command,
        [string]$pnpmCommand,
        [string]$argslist
    )
    if (-not $pnpmCommand){
        $pnpmCommand = $command
    }
    $commandItems = $command.split(" ")
    $pnpmCommandItems = $pnpmCommand.split(" ")
    $arglistItems = $argslist.split(" ")
    if ($usepnpm){
        & pnpm @pnpmCommandItems @arglistItems
    } else {
        & npm @commandItems @arglistItems
    }
}
function save-file {
    param(
        [string]$path,
        [string][Parameter(Mandatory, ValueFromPipeline)]$value
    )
    $utf8 = New-Object System.Text.UTF8Encoding $false
    [IO.File]::WriteAllText($path, $value, $utf8)
}
$removePackages = "@nuxtjs/tailwindcss radix-vue shadcn-nuxt prez-ui tailwind-merge"
invoke-npmcommand -command "uninstall" -pnpmCommand "remove" -argslist $removePackages

get-content -raw "nuxt.config.ts" |`
    foreach { $_ -replace '\"@nuxtjs\/tailwindcss\"[,]{0,1}',"" } |`
    foreach { $_ -replace '\"shadcn-nuxt\"[,]{0,1}',"" } | `
    save-file -path "nuxt.config.ts"

# 2. Remove required files & folders
remove-item "components.json"
remove-item "tailwind.config.js"
remove-item -recurse "components/ui"

# 3. Backup Tailwind variables
rename-item "assets/css/tailwind.css" "tailwind.txt"
New-Item -Path "assets/css/tailwind.css" -ItemType File 

# 4. Reinstall packages
remove-item -recurse ".nuxt"
remove-item -recurse ".output"
remove-item -recurse "node_modules"

invoke-npmcommand -command "install"
# 5. Install Tailwind 4
invoke-npmcommand -command "install" -pnpmCommand "add" -argslist "tailwindcss @tailwindcss/vite"
'@import "tailwindcss";' | save-file -path "assets/css/tailwind.css"

# 6. Install & initialise shadcn-vue
invoke-npmCommand -command "exec --" -pnpmCommand "dlx" -argslist "nuxi@latest module add shadcn-nuxt"

"import tailwindcss from "@tailwindcss/vite";`r`r" + (get-content -raw "nuxt.config.ts") | save-file -path "nuxt.config.ts"

get-content -raw "nuxt.config.ts" |`
    foreach { $_ -replace 'vite: {',"vite: {r`t`tplugins: [tailwindcss()]," } |
    foreach { $_ -replace "}[r`n]+","},`r" } |
    foreach { $_ -replace "\}\);?\s*$","tshadcn: {`r`t`tprefix: "",`r`t`tcomponentDir: "./components/ui`",r`t},`r});" } |
    save-file -path "nuxt.config.ts"

invoke-npmCommand -command "exec --" -pnpmCommand "dlx" -argslist "nuxi prepare"
invoke-npmCommand -command "exec --" -pnpmCommand "dlx" -argslist "shadcn-vue@latest init -d"

(get-content -raw "components.json") -replace "zinc","slate" | save-file -path "components.json"

& git clone -n --depth=1 --filter=tree:0 -b feature/tailwind4 --single-branch "https://github.com/rdflib/prez-ui"
push-location prez-ui
& git sparse-checkout set --no-cone /packages/create-prez-app/template/components/ui
& git checkout
pop-location
copy-item -recurse "prez-ui/packages/create-prez-app/template/components/ui" "components"
remove-item -recurse -force "prez-ui"

# 7. Install reka-ui
invoke-npmcommand -command "install" -pnpmCommand "add" -argslist "reka-ui"

# 8. Update tailwind.css
Invoke-WebRequest -Uri 'https://cdn.jsdelivr.net/gh/rdflib/prez-ui@feature/tailwind4/packages/create-prez-app/template/assets/css/tailwind.css' -OutFile "assets/css/tailwind.css"

# 9. Install prez-ui
invoke-npmcommand -command "install -D" -pnpmCommand "add -D" -argslist "../prez-ui/packages/prez-ui"

write-output  "Upgrade complete!"
write-output  "The next step is to convert your Tailwind CSS variables saved in 'tailwind.txt'"
write-output  "Follow step 8 in the upgrade guide"
write-output  "https://github.com/RDFLib/prez-ui/blob/feature/tailwind4/docs/upgrade.md#8-update-tailwindcss"