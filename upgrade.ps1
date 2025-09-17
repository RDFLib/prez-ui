$upgradeComplete = (get-content "package.json" | where-object {$_ -like "*`"tailwindcss`": `"`^4*" }).length -gt 0 
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

# 1. Uninstall old packages
$removePackages = "@nuxtjs/tailwindcss radix-vue shadcn-nuxt prez-ui tailwind-merge nuxt"
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

# 5. Install Nuxt 4
New-Item -Path "app" -ItemType Directory 
Move-Item -Path assets, components, composables, layouts, lib, pages, utils, app.config.ts, app.vue -Destination app

Invoke-WebRequest -Uri 'https://cdn.jsdelivr.net/gh/rdflib/prez-ui@feature/nuxt4/packages/create-prez-app/template/tsconfig.json' -OutFile "tsconfig.json"

invoke-npmcommand -command "install" -pnpmCommand "add" -argslist "-D nuxt"

# 6. Install Tailwind 4
invoke-npmcommand -command "install" -pnpmCommand "add" -argslist "tailwindcss @tailwindcss/vite"
'@import "tailwindcss";' | save-file -path "app/assets/css/tailwind.css"

# 7. Install & initialise shadcn-vue
invoke-npmCommand -command "exec --" -pnpmCommand "dlx" -argslist "nuxi@latest module add shadcn-nuxt"

"import tailwindcss from `"@tailwindcss/vite`";`r`r" + (get-content -raw "nuxt.config.ts") | save-file -path "nuxt.config.ts"

get-content -raw "nuxt.config.ts" |`
    foreach { $_ -replace 'vite: {',"vite: {`r`t`tplugins: [tailwindcss()]," } |`
    foreach { $_ -replace "}[`r`n]+","},`r" } |`
    foreach { $_ -replace "\}\);?\s*$","`tshadcn: {`r`t`tprefix: `"`",`r`t`tcomponentDir: `"@/components/ui`",`r`t},`r});" } |`
    save-file -path "nuxt.config.ts"

invoke-npmCommand -command "exec --" -pnpmCommand "dlx" -argslist "nuxi prepare"
invoke-npmCommand -command "exec --" -pnpmCommand "dlx" -argslist "shadcn-vue@latest init -d"

(get-content -raw "components.json") -replace "zinc","slate" | save-file -path "components.json"

& git clone -n --depth=1 --filter=tree:0 -b feature/nuxt4 --single-branch "https://github.com/rdflib/prez-ui"
push-location prez-ui
& git sparse-checkout set --no-cone /packages/create-prez-app/template/app/components/ui
& git checkout
pop-location
copy-item -recurse "prez-ui/packages/create-prez-app/template/app/components/ui" "app/components"
remove-item -recurse -force "prez-ui"

# 8. Install reka-ui
invoke-npmcommand -command "install" -pnpmCommand "add" -argslist "reka-ui"

# 9. Update tailwind.css
Invoke-WebRequest -Uri 'https://cdn.jsdelivr.net/gh/rdflib/prez-ui@feature/nuxt4/packages/create-prez-app/template/app/assets/css/tailwind.css' -OutFile "app/assets/css/tailwind.css"

# 10. Install prez-ui
invoke-npmcommand -command "install -D" -pnpmCommand "add -D" -argslist "../prez-ui/packages/prez-ui"

write-output  "Upgrade complete!"
write-output  "The next step is to convert your Tailwind CSS variables saved in 'tailwind.txt'"
write-output  "Follow step 9 in the upgrade guide"
write-output  "https://github.com/RDFLib/prez-ui/blob/feature/nuxt4/docs/upgrade.md#9-update-tailwindcss"
