#!/usr/bin/env bash

dir=$(pwd)/.env

export $(grep -v '^#' ${dir} | xargs)