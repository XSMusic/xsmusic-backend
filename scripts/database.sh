# Sirve para hacer una exportacion de la base de datos en cualquier entorno

source $(pwd)/scripts/setenv.sh

TYPE=${1} # proToUat  / uatToPro

COLLECTIONS=('artists' 'events' 'images' 'likes' 'media' 'menus' 'scrapingdiscarts' 'sites' 'styles' 'users')

proToUat() {
    mongoD ${MONGO_URI_PRO}
    deleteAll ${MONGO_URI_UAT}
    mongoR ${MONGO_URI_UAT}
}

uatToPro() {
    echo "uatToPro CUIDADO"
    mongoD ${MONGO_URI_UAT}
    deleteAll ${MONGO_URI_PRO}
    mongoR ${MONGO_URI_PRO}
}

mongoD() {
    mongodump --uri="${1}" -o ${PATH_DB} >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅  Backup $TYPE finalizado"
    else
        echo "❌  Backup $TYPE fallido"
        exit 1
    fi
}

deleteAll() {
    EVAL=''
    for i in "${COLLECTIONS[@]}"; do
        EVAL="${EVAL} db.${i}.deleteMany({});"
    done
    mongosh "$1" -eval "${EVAL}" >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅  Borrado $TYPE finalizado"
    else
        echo "❌  Borrado $TYPE fallido"
        exit 1
    fi
}

mongoR() {
    mongorestore --uri="${1}" ${PATH_DB}/XSMusic >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅  Restore $TYPE finalizado"
    else
        echo "❌  Restore $TYPE fallido"
        exit 1
    fi
}

init() {
    echo "🔥  Iniciando backup de la base de datos"
    if [ "$TYPE" = "proToUat" ]; then
        proToUat
    elif [ "$TYPE" = "uatToPro" ]; then
        uatToPro
    else
        echo "❌  No se ha especificado el tipo"
        exit 1
    fi
}

clear
init
