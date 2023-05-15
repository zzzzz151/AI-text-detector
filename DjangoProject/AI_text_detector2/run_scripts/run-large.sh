#!/bin/bash

if [ ! -d "venv" ]; then
    echo "Building a venv and installing dependencies"
    python3.7 -m venv venv
    PIP=venv/bin/pip

    $PIP install --upgrade pip
    $PIP install -r requirements.txt
fi

venv/bin/python test_model.py large