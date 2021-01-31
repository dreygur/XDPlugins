module.exports = `
    <style>
        *{
            font-family: 'San Francisco', 'Segoe UI', sans-serif;
        }

        .flex{
            display: flex;
        }

        .center-center{
            align-items: center;
            justify-content: center;
        }

        .relative{
            position: relative;
        }

        .absolute{
            position: absolute;
        }

        .inset-0{
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
        }

        .z-10{
            z-index: 10;
        }

        .p-0{
            padding: 0;
        }

        .px-0{
            padding-left: 0;
            padding-right: 0;
        }

        .m-auto{
            margin: auto;
        }

        .m-0{
            margin: 0;
        }

        .mx-0{
            margin-left: 0;
            margin-right: 0;
        }

        .mt-0{
            margin-top: 0;
        }

        .mt-1{
            margin-top: 0.25rem;
        }

        .mt-2{
            margin-top: 0.4rem;
        }

        .mt-3{
            margin-top: 0.8rem;
        }

        .mb-1{
            margin-bottom: 0.25rem;
        }

        .mb-2{
            margin-bottom: 0.4rem;
        }

        .mb-3{
            margin-bottom: 0.8rem;
        }

        .opacity-65{
            opacity: 0.65;
        }

        .text-md{
            font-size: 0.85rem;
            line-height: 1.5;
        }

        .text-lg{
            font-size: 1rem;
        }
        
        .text-center {
            text-align: center;
        }

        .break {
            flex-wrap: wrap;
        }
        
        input, button{
            margin: 0;
        }

        .popular-city img{
            width: 100%;
        }

        #locationInput{
            background: #fff;
            margin-right: 7px;
            flex: 1;
        }

        .row input{
            flex: 1
        }

        #loader{
            position: fixed;
            top: -16px; left: -16px;
            bottom: -16px; right: -16px;
            background: rgba(0, 0, 0, 0.3);
            z-index: 20;
        }

        .ui-loading-false #loader{
            display: none;
        }
        
        #loaderContent{
            background: #fff;
            padding: 0.5rem 1.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #1473E6;
            position: relative;
            z-index: 1;
        }

        #loaderContent p{
            margin-top: -2px;
            margin-bottom: 1rem;
            font-size: 1.2rem;
            line-height: 1.3em;
        }

        #loaderContent p + div{
            padding: 0.3rem 1.2rem;
            padding-bottom: 0.35rem;
            color: #777;
            border: 2px solid #ccc;
            border-radius: 16px;
            margin-bottom: 1rem;
            font-size: 0.9rem;
            font-weight: 500;
        }

        h1{
            font-size: 1.25rem;
            font-weight: bold;
            color: #3F3F3F;
            margin: 0;
            letter-spacing: -0.02em;
        }
        
        h2{
            font-size: 1.05rem;
            font-weight: 600;
            color: #3F3F3F;
            margin: 0;
            letter-spacing: -0.02em;
        }

        button.block{
            width: 100%;
        }

        .button{
            display: flex;
            align-items: center;
            justify-content: center;
            height: 24px;
        }

        .button[uxp-variant="action"]{
            width: 24px;
            border-radius: 50%;
            background: #1473E6;
        }

        .button[uxp-variant="action"] svg path{
            fill: #fff;
            width: 20px;
            height: 20px;
        }
        
        .button[uxp-variant="cta"]{
            width: 100%;
            height: 28px;
            line-height: 28px;
            font-weight: 600;
            font-size: 13px;
            background: #1473E6;
            color: #fff;
            border-radius: 14px;
            margin: 0;
        }

        .button[uxp-variant="cta"].large{
            font-size: 15px;
            height: 36px;
            line-height: 18px;
            border-radius: 20px;
        }

        .ui-itemSelected-true #warning,
        .ui-selectionIsValid-false #warning,
        .ui-selectionIsValid-true #invalidSelection,
        .ui-itemSelected-false #app,
        .ui-selectionIsValid-false #app{
            display: none;
        }

        #invalidSelection strong{
            color: #1473E6
        }
        
        .ui-currentScreen-customize #pickScreen,
        .ui-currentScreen-pick #customizeScreen{
            display: none;
        }

        #pickScreen{
            height: 100%;
            height: calc(100vh - 120px);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        #popularDestinations{
            flex: 1;
            max-height: 360px;
            overflow-y: auto;
        }

        .popular-city{
            color: white;
            font-size: 1.7rem;
            font-weight: 500;
            letter-spacing: 0.05em;
        }

        .popular-city:hover{
            opacity: 0.6;
        }

        .ui-fetchingLocation-false #coordinatesLoader,
        .ui-fetchingLocation-true #customizeFields{
            display: none;
        }

        #customizeScreenTitle{
            margin-bottom: 0.6rem;
            align-items: center;
        }
        
        #customizeScreenTitle span{
            margin-right: 0.3rem;
        }

        #customizeScreenTitle svg{
            width: 18px;
            height: 18px;
        }

        label{
            font-size: 0.85rem;
            margin-bottom: 0.4rem;
        }

        #mapPreview{
            width: 100%; 
            height: 55vw; 
            background: #ddd; 
            object-fit: cover; 
            object-position: center;
        }

        #fancyMaps.ui-loadingPreview-false #mapPreviewLoader{
            display: none !important;
        }

        #zoomLevel{
            margin-top: 2rem;
            margin-bottom: 0.6rem;
        }

        input[type="range"]{
            width: 100%
        }

        #zoomLevels{
            margin-top: 0.5rem;
            margin-bottom: 1.5rem;
            justify-content: space-between;
        }

        #zoomLevels div{
            margin-top: -7px;
            display: inline-flex;
            flex-direction: column;
        }

        #zoomLevels div span{
            position: relative;
            height: 8px;
            width: 2px;
            background: #ddd;
            margin-left: 3px;
            margin-bottom: 4px;
            align-self: center;
        }

        #zoomLevels div:first-child span{
            margin-left: 1px;
            align-self: flex-start;
        }
        
        #zoomLevels div:last-child span{
            align-self: flex-end;
        }

        #mapTypes,
        #mapTypesDefault{
            margin-right: -0.3rem;
            margin-bottom: 0.6rem;
            display: flex;
            flex-wrap: wrap;
            max-height: 150px;
            overflow-y: auto;
        }

        #fancyMaps.ui-coords-null #mapTypes,
        #fancyMaps:not(.ui-coords-null) #mapTypesDefault{
            display: none !important;
        }

        .map-type{
            position: relative;
            justify-content: center;
            background: #ddd;
            padding-bottom: calc(23.333% - 0.3rem);
            flex-shrink: 0;
            min-width: calc(33.333% - 0.3rem);
            margin-right: 0.3rem;
            margin-bottom: 0.3rem;
        }

        .map-type img{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
            z-index: 1;
            border: 3px solid white;
            border-radius: 3px;
        }

        .map-type:hover img{
            opacity: 0.7;
        }
        
        .ui-mapType-light #mapTypeLight img,
        .ui-mapType-dark #mapTypeDark img,
        .ui-mapType-sat #mapTypeSat img,
        .map-type.current img{
            opacity: 1;
            border-color: #1473E6;
        }

        #applyMap{
            margin-top: 1.7rem
        }

        #applyMap h2{
            margin-bottom: 0.7rem
        }
    </style>
`;