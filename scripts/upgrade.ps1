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
$removePackages = "@nuxtjs/tailwindcss radix-vue tailwindcss-animate prez-ui"

$removePackages.split(" ") | ForEach-Object {
    $pkg=$_
    if ((invoke-npmcommand -command "list" -pnpmCommand "list" -argslist "--depth=0 $_" | where-object {$_ -like "*$pkg*" }).length -gt 0) {
        invoke-npmcommand -command "uninstall" -pnpmCommand "remove" -argslist $_
    }
}

# 2. Update packages
$updatePackages = "tailwind-merge nuxt shadcn-nuxt"
$prezPackages = "prez-lib prez-components"

$prezPackages.split(" ") | ForEach-Object {
    $pkg=$_
    if ((invoke-npmcommand -command "list" -pnpmCommand "list" -argslist "--depth=0 $_" | where-object {$_ -like "*$pkg*" }).length -gt 0) {
        $updatePackages += " $_"
    }
}

if ($usePnpm) {
    $up = "$updatePackages --latest"
} else {
    $up = $updatePackages.split(" ") | ForEach-Object {"$_@latest"} | join " "
}
invoke-npmcommand -command "install" -pnpmCommand "update" -argslist $up

# 3. Install packages
$installPackages = "tailwindcss @tailwindcss/vite tw-animate-css reka-ui @vueuse/core"
invoke-npmcommand -command "install" -pnpmCommand "add" -argslist $installPackages

# temp - install dev packages
invoke-npmcommand -command "install" -pnpmCommand "add" -argslist "-D ../prez-ui/packages/prez-ui"

# 4. Remove files
$shadComponents = (Get-ChildItem -Path components/ui).name
remove-item "tailwind.config.js"
remove-item -recurse "components/ui"

# 5. Move files into app/
New-Item -Path "app" -ItemType Directory 
Move-Item -Path assets, components, composables, layouts, lib, pages, utils, app.config.ts, app.vue -Destination app -ErrorAction SilentlyContinue

# 6. Update nuxt.config.ts
"import tailwindcss from `"@tailwindcss/vite`";`r`r" + (get-content -raw "nuxt.config.ts") | save-file -path "nuxt.config.ts"

get-content -raw "nuxt.config.ts" |`
    ForEach-Object { $_ -replace '\"@nuxtjs\/tailwindcss\"[,]{0,1}',"" } |`
    ForEach-Object { $_ -replace 'vite: {',"vite: {`r`t`tplugins: [tailwindcss()]," } |`
    ForEach-Object { $_ -replace "}[`r`n]+","},`r" } |`
    ForEach-Object { $_ -replace "\}\);?\s*$","`tshadcn: {`r`t`tprefix: `"`",`r`t`tcomponentDir: `"./app/components/ui`",`r`t},`r});" } |`
    save-file -path "nuxt.config.ts"

# 7. Update tsconfig.json
Invoke-WebRequest -Uri 'https://cdn.jsdelivr.net/gh/rdflib/prez-ui@feature/tailwind4/packages/create-prez-app/template/tsconfig.json' -OutFile "tsconfig.json"

# 8. Copy shadcn components
Invoke-WebRequest -Uri 'https://cdn.jsdelivr.net/gh/rdflib/prez-ui@feature/tailwind4/packages/create-prez-app/template/components.json' -OutFile "components.json"

Invoke-WebRequest -Uri 'https://cdn.jsdelivr.net/gh/rdflib/prez-ui@feature/tailwind4/packages/create-prez-app/template/app/lib/utils.ts' -OutFile "app/lib/utils.ts"

& git clone -n --depth=1 --filter=tree:0 -b feature/tailwind4 --single-branch "https://github.com/rdflib/prez-ui"
push-location prez-ui
& git sparse-checkout set --no-cone /packages/create-prez-app/template/app/components/ui
& git checkout
pop-location
copy-item -recurse "prez-ui/packages/create-prez-app/template/app/components/ui" "app/components"
remove-item -recurse -force "prez-ui" -ErrorAction SilentlyContinue

# 9. Update Tailwind variables
rename-item "app/assets/css/tailwind.css" "tailwind.txt"
New-Item -Path "app/assets/css/tailwind.css" -ItemType File
Invoke-WebRequest -Uri 'https://cdn.jsdelivr.net/gh/rdflib/prez-ui@feature/tailwind4/packages/create-prez-app/template/app/assets/css/tailwind.css' -OutFile "app/assets/css/tailwind.css"

# 10. (Optional) Re-install extra shadcn components
$templateShadComponents = (Get-ChildItem -Path app/components/ui).name
$diffComponents = $shadComponents | Where-Object {$templateShadComponents -NotContains $_}

invoke-npmCommand -command "exec --" -pnpmCommand "dlx" -argslist "nuxi prepare"
if ($diffComponents.Length -gt 0) {
    write-output  "Choose no (N) to overriding components if prompted below"
    invoke-npmCommand -command "exec --" -pnpmCommand "dlx" -argslist "shadcn-vue@latest add $diffComponents"
}

write-output  "-----------------------------"
write-output  "Upgrade complete!"
write-output  "The next step is to convert your Tailwind CSS variables saved in 'tailwind.txt'"
write-output  "Follow step 9 in the upgrade guide"
write-output  "https://github.com/RDFLib/prez-ui/blob/feature/tailwind4/docs/upgrade.md#9-update-tailwindcss"
write-output  "(Note: You may need to remove the prez-ui folder as it may not have been deleted properly)"
