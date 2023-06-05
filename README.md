# AI Text Detector - Project for Projeto em Informática 2023

# Team

Alexandre Gazur (102751)

Daniel Ferreira (102885)

Ricardo Pinto (103078)

# Project website

https://zzzzz151.github.io/AI-text-detector/

# Abstract

Our project is an AI Text Detector as a Chrome browser extension.

Whenever you open a web page or PDF in your browser, it will evaluate for AI generated text in it.

It will display an overall evaluation, highlight parts of the text that it considers is probably AI generated, and you can also select any text and evaluate it.

With Mozilla's PDF viewer, it even works on PDFs!

The extension has a thorough and intuitive UI that lets you select the model, highlighting colors, and other settings. It also has buttons that redirect the user to our Model Hub and to Mozilla's PDF Viewer, for easy navigation. Finally, the extension UI also has a text area for the user to write any text and analyse it.

Users can also add their own AI text detector model to our system through our Model Hub, be it as a python script or as an API, making the model available to all users.

# [Video](https://www.youtube.com/watch?v=QulxLQb4c70)

# How to run

To load the extension, in ai4-td-extension folder, run

`npm install`

`npm run dev`

The browser extension is compiled into ai4-td-extension/build/chrome-mv3-dev, load it as unpacked extension in the browser (with npm terminal running)

To launch the backend, have Docker Desktop running and run run.bat in CMD with

`run`

You can add models in our Model Hub at 193.136.175.107:8000/model-hub


