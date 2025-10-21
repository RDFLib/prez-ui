UPGRADE_DONE=$(grep -Eq '\"tailwindcss\": \"\^?4' package.json && echo true || echo false)
if $UPGRADE_DONE; then
    echo "This theme has already been upgraded"
    exit 0
fi

MAC_OS=$([ $(uname -s) == Darwin ] && echo true || echo false)
USE_PNPM=$([ -f pnpm-lock.yaml ] && echo true || echo false)

if $USE_PNPM; then
    MANAGER="pnpm"
else
    MANAGER="npm"
fi

if $MAC_OS; then
    SED_FLAGS=( -i '' )
else
    SED_FLAGS=( -i )
fi

# 1. Uninstall old packages
REMOVE_PACKAGES=(@nuxtjs/tailwindcss radix-vue tailwindcss-animate prez-ui)

for package in "${REMOVE_PACKAGES[@]}"; do
    if $MANAGER list --depth=0 | grep $package; then
        if $USE_PNPM; then
            pnpm remove $package
        else
            npm uninstall $package
        fi
    fi
done

# 2. Update packages
UPDATE_PACKAGES=(tailwind-merge nuxt shadcn-nuxt)
PREZ_PACKAGES=(prez-lib prez-components)

for package in "${PREZ_PACKAGES[@]}"; do
    if $MANAGER list --depth=0 | grep $package; then
        UPDATE_PACKAGES+=($package)
    fi
done

if $USE_PNPM; then
    pnpm update "${UPDATE_PACKAGES[@]}" --latest
else
    npm install "${UPDATE_PACKAGES[@]/%/@latest}"
fi

# 3. Install packages
INSTALL_PACKAGES=(tailwindcss @tailwindcss/vite tw-animate-css reka-ui @vueuse/core)
if $USE_PNPM; then
    pnpm add "${INSTALL_PACKAGES[@]}"
else
    npm install "${INSTALL_PACKAGES[@]}"
fi

# temp - install dev packages
if $USE_PNPM; then
    pnpm add -D ../prez-ui/packages/prez-ui
else
    npm install -D ../prez-ui/packages/prez-ui
fi

# 4. Remove files
SHAD_COMPONENTS=$(ls components/ui)

rm -f tailwind.config.js
rm -rf components/ui

# 5. Move files into app/
mkdir app
mv assets components composables layouts lib pages utils app.config.ts app.vue -t app 2>/dev/null

# 6. Update nuxt.config.ts
sed "${SED_FLAGS[@]}" "-e" 's/\"@nuxtjs\/tailwindcss\"[,]\{0,1\}//g' nuxt.config.ts

sed "${SED_FLAGS[@]}" "-e" '1s/^/import tailwindcss from "@tailwindcss\/vite";\n\n/' nuxt.config.ts

sed "${SED_FLAGS[@]}" '/vite: {/ a\
        plugins: \[tailwindcss\(\)\],
' nuxt.config.ts

sed "${SED_FLAGS[@]}" "-e" 's/\(}\)$/\1,/g' nuxt.config.ts

sed "${SED_FLAGS[@]}" '/});$/ i\
    shadcn: \{\
        prefix: \"\",\
        componentDir: \".\/app\/components\/ui\"\
    \},\
' nuxt.config.ts

# 7. Update tsconfig.json
curl https://cdn.jsdelivr.net/gh/rdflib/prez-ui@feature/tailwind4/packages/create-prez-app/template/tsconfig.json > tsconfig.json

# 8. Copy shadcn components
curl https://cdn.jsdelivr.net/gh/rdflib/prez-ui@feature/tailwind4/packages/create-prez-app/template/components.json > components.json

curl https://cdn.jsdelivr.net/gh/rdflib/prez-ui@feature/tailwind4/packages/create-prez-app/template/app/lib/utils.ts > app/lib/utils.ts

git clone -n --depth=1 --filter=tree:0 -b feature/tailwind4 --single-branch https://github.com/rdflib/prez-ui
cd prez-ui
git sparse-checkout set --no-cone /packages/create-prez-app/template/app/components/ui
git checkout
cd ..
mv prez-ui/packages/create-prez-app/template/app/components/ui app/components
rm -rf prez-ui

# 9. Update Tailwind variables
mv app/assets/css/tailwind.css app/assets/css/tailwind.txt
touch app/assets/css/tailwind.css
curl https://cdn.jsdelivr.net/gh/rdflib/prez-ui@feature/tailwind4/packages/create-prez-app/template/app/assets/css/tailwind.css > app/assets/css/tailwind.css

# 10. (Optional) Re-install extra shadcn components
TEMPLATE_SHAD_COMPONENTS=$(ls app/components/ui)
DIFF_COMPONENTS=(`echo ${SHAD_COMPONENTS[@]} ${TEMPLATE_SHAD_COMPONENTS[@]} | tr ' ' '\n' | sort | uniq -u `)

if $USE_PNPM; then
    pnpm dlx nuxi prepare
else
    npx nuxi prepare
fi

if $USE_PNPM; then
    yes n | pnpm dlx shadcn-vue@latest add "${DIFF_COMPONENTS[@]}"
else
    yes n | npx shadcn-vue@latest add "${DIFF_COMPONENTS[@]}"
fi

echo "-----------------------------"
echo "Upgrade complete!"
echo "The next step is to convert your Tailwind CSS variables saved in 'tailwind.txt'"
echo "Follow step 9 in the upgrade guide"
echo "https://github.com/RDFLib/prez-ui/blob/feature/tailwind4/docs/upgrade.md#9-update-tailwindcss"
