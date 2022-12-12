source $(pwd)/scripts/setenv.sh
exec 2>$(pwd)/scripts/error.log

path="${PATH_PROJECT}/app"

generate() {
    cd ${path} && npm run build > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅  Build finalizado"
    else
        echo "❌  Creacion fallida"
        exit 1
    fi
}

deploy() {
    cd ${path} && firebase deploy --project xsmusic-69 > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅  Deploy finalizado"
        echo "💎  Ruta APP: https://xsmusic.carstournaments.com"
    else
        echo "❌  Deploy fallido"
        exit 1
    fi
}

clear
echo "🔨  Generando PWA"
generate
deploy