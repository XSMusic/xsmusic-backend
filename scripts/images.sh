source $(pwd)/scripts/setenv.sh

TYPE=${1} # proToLocal or localToPro

proToLocal() {
    echo "🔨  Exportando imagenes al servidor local"
    rsync -avzhe "ssh -p 69" ${SSH_HOST}:${PATH_APPS_PRO}/uploads/xsmusic/ $PATH_UPLOADS/ > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅  Sincronizacion de imagenes Servidor-Localhost completada"
    else
        echo "❌  Sincronizacion de imagenes Servidor-Localhost fallida"
        exit 1
    fi
}

localToPro() {
    echo "🔨  Exportando imagenes al servidor de produccion"
    rsync -avzhe "ssh -p 69" $PATH_UPLOADS/ josexs@xsmusic.es:${PATH_APPS_PRO}/uploads/xsmusic/ 
    if [ $? -eq 0 ]; then
        echo "✅  Sincronizacion de imagenes Localhost-Servidor completada"
    else
        echo "❌  Sincronizacion de imagenes Localhost-Servidor fallida"
        exit 1
    fi
}

clear

if [ "${TYPE}" = "proToLocal" ]; then
    proToLocal
elif [ "${TYPE}" = "localToPro" ]; then
    localToPro
else
    echo "❌  Tipo de sincronizacion de imagenes no reconocido"
    exit 1
fi