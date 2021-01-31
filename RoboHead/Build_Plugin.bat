npm install &&(
    npm install -g yarn &&(
        yarn build &&(
            @RD /S /Q "E:\Ganesh\PROJECTS\AQUENT\roboadobeplugin\Release1.0\node_modules" &&(
                npm install -g @adobe/xdpm &&(
                    xdpm package
                )))))