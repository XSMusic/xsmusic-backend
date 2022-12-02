source $(pwd)/scripts/setenv.sh
exec 2>$(pwd)/scripts/error.log

clear

build() {
    echo "🔥  Actualizando app de produccion"
    cd ${PATH_PROJECT}/app && npm run build:ssr >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅  Build completado"
    else
        echo "❌  Build no completado"
        exit 1
    fi
}

copyPWAToLocal() {
    mv ${PATH_PROJECT}/app/dist/xsmusic ${PATH_PROJECT}/backend/pwa >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅  SSR copiado a carpeta de backend"
    else
        echo "❌  SSR NO copiado a carpeta de backend"
        exit 1
    fi
}

deletePWAProd() {
    COMMAND="rm -r /home/josexs/apps/xsmusic/pwa"
    COMMANDS="bash -i -c '${COMMAND}'"
    ssh ${SSH_HOST} -p 69 ${COMMANDS} >/dev/null 2>&1
}

copyPWALocalToServer() {
    echo "🔨  Exportando PWA al servidor de produccion"
    echo 'rsync -avzhe "ssh -p 69" ${PATH_PROJECT}/backend/pwa/  josexs@api.xsmusic.es:${PATH_APPS_PRO}/uploads/xsmusic/ '
    rsync -avzhe "ssh -p 69" ${PATH_PROJECT}/backend/pwa/ -p 69 josexs@api.xsmusic.es:${PATH_APPS_PRO}/xsmusic/pwa
    if [ $? -eq 0 ]; then
        echo "✅  Sincronizacion de pwa Localhost-Servidor completada"
    else
        echo "❌  Sincronizacion de pwa Localhost-Servidor fallida"
        exit 1
    fi
}

startPM2() {
    COMMAND="cd /home/josexs/apps/xsmusic && npm run start:ssr"
    COMMANDS="bash -i -c '${COMMAND}'"
    ssh ${SSH_HOST} -p 69 ${COMMANDS} >/dev/null 2>&1
}

# build
# copyPWAToLocal
# deletePWAProd
# copyPWALocalToServer
startPM2