source $(pwd)/scripts/setenv.sh
exec 2>$(pwd)/scripts/error.log

clear

build() {
    echo "🔥  Creando PWA + SSR"
    cd ${PATH_PROJECT}/app && npm run build:ssr >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅  Creacioncompletada"
    else
        echo "❌  Creacion no completada"
        exit 1
    fi
}

copyPWAToLocal() {
    echo "🔥  Copiando archivos de PWA + SSR a carpeta de backend"
    mv ${PATH_PROJECT}/app/dist/xsmusic ${PATH_PROJECT}/backend/pwa >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅  Copia correcta"
    else
        echo "❌  Copia no completada"
        exit 1
    fi
}

deletePWAProd() {
    echo "🔥  Eliminando PWA + SSR de servidor"
    COMMAND="rm -r /home/josexs/apps/xsmusic/pwa"
    COMMANDS="bash -i -c '${COMMAND}'"
    ssh ${SSH_HOST} -p 69 ${COMMANDS} >/dev/null 2>&1
     if [ $? -eq 0 ]; then
        echo "✅  Eliminacion correcta"
    else
        echo "❌  Eliminacion no completada"
        exit 1
    fi
}

copyPWALocalToServer() {
    echo "🔨  Copiando PWA + SSR al servidor de produccion"
    rsync -avzhe "ssh -p 69" ${PATH_PROJECT}/backend/pwa/ -p 69 josexs@api.xsmusic.es:${PATH_APPS_PRO}/xsmusic/pwa >/dev/null 2>&1
}

startPM2() {
    echo "🔥  Iniciando PM2"
    COMMAND="cd /home/josexs/apps/xsmusic && pm2 start pm2-pwa.json && pm2 save"
    COMMANDS="bash -i -c '${COMMAND}'"
    ssh ${SSH_HOST} -p 69 ${COMMANDS} 
}

deleteTempFiles() {
    echo "🔥  Eliminando archivos temporales PM2"
    rm -r ${PATH_PROJECT}/backend/pwa >/dev/null 2>&1
}



build
copyPWAToLocal
deletePWAProd
copyPWALocalToServer
startPM2
deleteTempFiles
echo "✅  Actualizacion APP completada"