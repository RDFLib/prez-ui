UPGRADE_DONE=$(grep -Eq '\"tailwindcss\": \"\^?4' package.json && echo true || echo false)
if $UPGRADE_DONE; then
    echo "This theme has already been upgraded"
    exit 0
fi

MAC_OS=$([ $(uname -s) == Darwin ] && echo true || echo false)
USE_PNPM=$([ -f pnpm-lock.yaml ] && echo true || echo false)

if $MAC_OS; then
    SED_FLAGS=( -i '' )
else
    SED_FLAGS=( -i )
fi

# 1. Uninstall old packages
REMOVE_PACKAGES="@nuxtjs/tailwindcss radix-vue shadcn-nuxt prez-ui tailwind-merge nuxt"
if $USE_PNPM; then
    pnpm remove $REMOVE_PACKAGES
else
    npm uninstall $REMOVE_PACKAGES
fi

sed "${SED_FLAGS[@]}" "-e" 's/\"@nuxtjs\/tailwindcss\"[,]\{0,1\}//g' nuxt.config.ts
sed "${SED_FLAGS[@]}" "-e" 's/\"shadcn-nuxt\"[,]\{0,1\}//g' nuxt.config.ts

# 2. Backup Tailwind variables
mv assets/css/tailwind.css assets/css/tailwind.txt
touch assets/css/tailwind.css

# 3. Remove files
rm -f components.json
rm -f tailwind.config.js
rm -rf components/ui
rm -rf .nuxt
rm -rf .output
rm -rf node_modules

# 4. Reorganise folder structure
mkdir app
mv assets components composables layouts lib pages utils app.config.ts app.vue -t app 2>/dev/null

curl https://cdn.jsdelivr.net/gh/rdflib/prez-ui@feature/tailwind4/packages/create-prez-app/template/tsconfig.json > tsconfig.json

# 5. Reinstall packages
if $USE_PNPM; then
    pnpm add -D nuxt
else
    npm install -D nuxt
fi

PREPARE="nuxi prepare"
if $USE_PNPM; then
    pnpm dlx $PREPARE
else
    npx $PREPARE
fi

# 6. Install Tailwind 4
TAILWIND_PACKAGES="tailwindcss @tailwindcss/vite"
if $USE_PNPM; then
    pnpm add $TAILWIND_PACKAGES
else
    npm install $TAILWIND_PACKAGES
fi

echo '@import "tailwindcss";' > app/assets/css/tailwind.css

sed "${SED_FLAGS[@]}" "-e" '1s/^/import tailwindcss from "@tailwindcss\/vite";\n\n/' nuxt.config.ts
sed "${SED_FLAGS[@]}" '/vite: {/ a\
        plugins: \[tailwindcss\(\)\],
' nuxt.config.ts

# 7. Install & initialise shadcn-vue
SHAD_ADD="nuxi@latest module add shadcn-nuxt"
if $USE_PNPM; then
    pnpm dlx $SHAD_ADD
else
    npx $SHAD_ADD
fi

sed "${SED_FLAGS[@]}" "-e" 's/\(}\)$/\1,/g' nuxt.config.ts

sed "${SED_FLAGS[@]}" '/});$/ i\
    shadcn: \{\
        prefix: \"\",\
        componentDir: \"@\/components\/ui\"\
    \},\
' nuxt.config.ts

if $USE_PNPM; then
    pnpm dlx $PREPARE
else
    npx $PREPARE
fi

SHAD_INIT="shadcn-vue@latest init -d"
if $USE_PNPM; then
    pnpm dlx $SHAD_INIT
else
    npx $SHAD_INIT
fi

sed "${SED_FLAGS[@]}" "-e" 's/zinc/slate/g' components.json

git clone -n --depth=1 --filter=tree:0 -b feature/tailwind4 --single-branch https://github.com/rdflib/prez-ui
cd prez-ui
git sparse-checkout set --no-cone /packages/create-prez-app/template/app/components/ui
git checkout
cd ..
mv prez-ui/packages/create-prez-app/template/app/components/ui app/components
rm -rf prez-ui

# 8. Install reka-ui
if $USE_PNPM; then
    pnpm install --force
    pnpm add reka-ui
else
    npm install reka-ui
fi

# 9. Update tailwind.css
curl https://cdn.jsdelivr.net/gh/rdflib/prez-ui@feature/tailwind4/packages/create-prez-app/template/app/assets/css/tailwind.css > app/assets/css/tailwind.css

# 10. Install prez-ui
if $USE_PNPM; then
    pnpm add -D ../prez-ui/packages/prez-ui
else
    npm install -D ../prez-ui/packages/prez-ui
fi

echo "Upgrade complete!"
echo "The next step is to convert your Tailwind CSS variables saved in 'tailwind.txt'"
echo "Follow step 9 in the upgrade guide"
echo "https://github.com/RDFLib/prez-ui/blob/feature/tailwind4/docs/upgrade.md#9-update-tailwindcss"
