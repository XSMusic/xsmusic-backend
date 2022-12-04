source $(pwd)/scripts/setenv.sh
exec 2>$(pwd)/scripts/error.log

clear

echo "🔥  Actualizando backend de produccion"

if [ "${NODE_ENV}" = "development" ]; then
    COMMAND="cd /home/josexs/apps/xsmusic && npm run update:server"
    COMMANDS="bash -i -c '${COMMAND}'"
  
    echo "🔥  Actualizando desde local"
    # echo "ssh -D 69 ${SSH_HOST} ${COMMANDS}"
    ssh -p 69 ${SSH_HOST} ${COMMANDS} >/dev/null 2>&1

    if [ $? -eq 0 ]; then
        echo "✅  Actualizacion de backend desde local finalizada"
    else
        echo "❌  Actualizacion de backend desde local fallida"
        exit 1
    fi
else
    pm2 stop xsmusic >/dev/null 2>&1
    PATH_BACKEND="/home/josexs/apps/xsmusic"
    echo "🔥  Actualizando backend desde Produccion"
    cd /home/josexs/apps/xsmusic && git checkout . && git pull >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅  Pull finalizado"
    else
        echo "❌  Pull fallido"
        exit 1
    fi
    cd $PATH_BACKEND && npm i >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅  Instalacion de dependencias finalizada"
    else
        echo "❌  Instalacion de dependencias fallida"
        exit 1
    fi

    pm2 restart xsmusic >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅  Pm2 finalizado"
    else
        echo "❌  Pm2 fallido"
        exit 1
    fi
fi
