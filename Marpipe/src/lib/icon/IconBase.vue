<template>
  <!-- IMAGE -->
  <!-- <svg v-if="icon === 'image'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11.5 11.5">
    <g id="Group_3580" data-name="Group 3580" transform="translate(-296.018 33.075)">
      <g id="Path_4772" data-name="Path 4772" transform="translate(296.078 -27.276)">
        <path
          id="Path_4842"
          data-name="Path 4842"
          d="M306.37-6.648a.548.548,0,0,1-.462-.253l-.194-.307c-.495-.784-.731-1.135-1.132-1.229a2.749,2.749,0,0,0-.732,0,2.957,2.957,0,0,1-1.831-.281,2.7,2.7,0,0,1-.865-1.023c-.391-.66-.669-1.064-1.433-1.064a2.854,2.854,0,0,0-2.428,2.045.548.548,0,0,1-.714.3.548.548,0,0,1-.3-.714A3.82,3.82,0,0,1,299.72-11.9a2.626,2.626,0,0,1,2.376,1.6,1.991,1.991,0,0,0,.486.643,2.035,2.035,0,0,0,1.186.128,3.5,3.5,0,0,1,1.064.029c.855.2,1.276.867,1.809,1.711l.191.3a.548.548,0,0,1-.166.757A.547.547,0,0,1,306.37-6.648Z"
          transform="translate(-296.237 11.904)"
          fill="#5eced6"
        />
      </g>
      <g id="Ellipse_873" data-name="Ellipse 873" transform="translate(301.936 -30.256)">
        <path
          id="Path_4843"
          data-name="Path 4843"
          d="M319.224-19.579a1.6,1.6,0,0,1-1.6-1.6,1.6,1.6,0,0,1,1.6-1.6,1.6,1.6,0,0,1,1.6,1.6A1.6,1.6,0,0,1,319.224-19.579Zm0-2.246a.644.644,0,0,0-.644.643.644.644,0,0,0,.644.643.644.644,0,0,0,.643-.643A.644.644,0,0,0,319.224-21.824Z"
          transform="translate(-317.622 22.783)"
          fill="#9d9d9d"
        />
      </g>
      <g id="Rectangle_3188" data-name="Rectangle 3188" transform="translate(296.018 -33.075)">
        <path
          id="Path_4844"
          data-name="Path 4844"
          d="M304.864-21.575h-6.193a2.657,2.657,0,0,1-2.654-2.654v-6.192a2.657,2.657,0,0,1,2.654-2.654h6.193a2.657,2.657,0,0,1,2.654,2.654v6.192A2.657,2.657,0,0,1,304.864-21.575Zm-6.193-10.4a1.56,1.56,0,0,0-1.558,1.558v6.192a1.56,1.56,0,0,0,1.558,1.558h6.193a1.56,1.56,0,0,0,1.558-1.558v-6.192a1.56,1.56,0,0,0-1.558-1.558Z"
          transform="translate(-296.018 33.075)"
          fill="#9d9d9d"
        />
      </g>
    </g>
  </svg> -->
  <img v-if="icon === 'image'" :src="imageRoute('Image')" />

  <!-- TEXT -->
  <!-- <svg v-else-if="icon === 'text'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 9.449">
    <g id="Group_3581" data-name="Group 3581" transform="translate(-294.953 29.451)">
      <path
        id="Icon_material-text-fields"
        data-name="Icon material-text-fields"
        d="M294.953-28.506h0a.945.945,0,0,0,.945.945h1.439a.766.766,0,0,1,.766.766h0v5.849a.945.945,0,0,0,.945.945h0a.945.945,0,0,0,.945-.945V-26.8a.766.766,0,0,1,.766-.766h1.44a.945.945,0,0,0,.944-.945h0a.944.944,0,0,0-.944-.945h-6.3A.945.945,0,0,0,294.953-28.506Z"
        transform="translate(0)"
        fill="#9d9d9d"
      />
      <path
        id="Path_4775"
        data-name="Path 4775"
        d="M322.947-18.033h-3.781a.945.945,0,0,0-.944.945h0a.945.945,0,0,0,.944.945h.473a.472.472,0,0,1,.472.472h0v2.992a.945.945,0,0,0,.945.945h0a.944.944,0,0,0,.945-.945h0v-2.992a.473.473,0,0,1,.473-.472h.474a.945.945,0,0,0,.945-.945h0A.945.945,0,0,0,322.947-18.033Z"
        transform="translate(-16.938 -8.312)"
        fill="#5eced6"
      />
    </g>
  </svg> -->
  <img v-else-if="icon === 'text'" :src="imageRoute('Text')"/>

  <!-- COMBO -->
  <!-- <svg
    v-else-if="icon === 'combo'"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 144 144"
  >
    <defs>
      <clipPath id="clip-Element-Color">
        <rect width="144" height="144" />
      </clipPath>
    </defs>
    <g id="Element-Color" clip-path="url(#clip-Element-Color)">
      <g id="Group_3620" data-name="Group 3620" transform="translate(-292.509 41.084)">
        <g id="Ellipse_875" data-name="Ellipse 875" transform="translate(307.509 -34.084)">
          <g id="Group_3612" data-name="Group 3612" transform="translate(0.305 0.102)">
            <circle
              id="Ellipse_901"
              data-name="Ellipse 901"
              cx="64.5"
              cy="64.5"
              r="64.5"
              transform="translate(0 0)"
              fill="none"
            />
          </g>
          <g id="Group_3613" data-name="Group 3613">
            <path
              id="Path_4854"
              data-name="Path 4854"
              d="M362.161,95.221a64.725,64.725,0,0,1-64.652-64.652h8.816A55.805,55.805,0,1,0,313.7,2.809l-7.647-4.39a64.658,64.658,0,1,1,56.107,96.8Z"
              transform="translate(-297.509 34.084)"
              fill="#b0b4c0"
            />
          </g>
        </g>
        <g id="Ellipse_876" data-name="Ellipse 876" transform="translate(292.509 -4.696)">
          <g id="Group_3614" data-name="Group 3614" transform="translate(0 0.714)">
            <ellipse
              id="Ellipse_902"
              data-name="Ellipse 902"
              cx="20.5"
              cy="20"
              rx="20.5"
              ry="20"
              fill="none"
            />
          </g>
          <g id="Group_3615" data-name="Group 3615" transform="translate(0.001)">
            <path
              id="Path_4855"
              data-name="Path 4855"
              d="M313.08,17.058A20.594,20.594,0,0,1,292.509-3.513,20.594,20.594,0,0,1,313.08-24.084,20.6,20.6,0,0,1,333.651-3.513,20.6,20.6,0,0,1,313.08,17.058Zm0-29.387a8.825,8.825,0,0,0-8.816,8.816A8.825,8.825,0,0,0,313.08,5.3,8.827,8.827,0,0,0,321.9-3.513,8.827,8.827,0,0,0,313.08-12.329Z"
              transform="translate(-292.509 24.084)"
              fill="#fff"
            />
          </g>
        </g>
        <g id="Ellipse_878" data-name="Ellipse 878" transform="translate(292.509 -4.696)">
          <g id="Group_3616" data-name="Group 3616" transform="translate(0 0.714)">
            <ellipse
              id="Ellipse_903"
              data-name="Ellipse 903"
              cx="20.5"
              cy="20"
              rx="20.5"
              ry="20"
              fill="none"
            />
          </g>
          <g id="Group_3617" data-name="Group 3617" transform="translate(0.001)">
            <path
              id="Path_4856"
              data-name="Path 4856"
              d="M313.08,17.058A20.594,20.594,0,0,1,292.509-3.513,20.594,20.594,0,0,1,313.08-24.084,20.6,20.6,0,0,1,333.651-3.513,20.6,20.6,0,0,1,313.08,17.058Zm0-29.387a8.825,8.825,0,0,0-8.816,8.816A8.825,8.825,0,0,0,313.08,5.3,8.827,8.827,0,0,0,321.9-3.513,8.827,8.827,0,0,0,313.08-12.329Z"
              transform="translate(-292.509 24.084)"
              fill="#b0b4c0"
            />
          </g>
        </g>
        <g id="Ellipse_877" data-name="Ellipse 877" transform="translate(345.407 3.018)">
          <g id="Group_3618" data-name="Group 3618" transform="translate(0.101)">
            <ellipse
              id="Ellipse_904"
              data-name="Ellipse 904"
              cx="27.5"
              cy="28.5"
              rx="27.5"
              ry="28.5"
              transform="translate(0)"
              fill="none"
            />
          </g>
          <g id="Group_3619" data-name="Group 3619" transform="translate(0 1.102)">
            <path
              id="Path_4857"
              data-name="Path 4857"
              d="M338.427,34.752A27.918,27.918,0,1,1,366.345,6.834,27.951,27.951,0,0,1,338.427,34.752Zm0-41.142A13.224,13.224,0,1,0,351.651,6.834,13.239,13.239,0,0,0,338.427-6.39Z"
              transform="translate(-310.509 21.084)"
              fill="none"
            />
          </g>
        </g>
      </g>
      <g
        id="Ellipse_905"
        data-name="Ellipse 905"
        transform="translate(50 43)"
        fill="none"
        stroke="#5eced6"
        stroke-width="15"
      >
        <circle cx="29" cy="29" r="29" stroke="none" />
        <circle cx="29" cy="29" r="21.5" fill="none" />
      </g>
    </g>
  </svg> -->

  <!-- COMBO BLUE -->
  <!-- <svg
    v-else-if="icon === 'combo-blue'"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 13 11.673"
  >
    <g id="Group_3620" data-name="Group 3620" transform="translate(-292.509 34.084)">
      <g id="Ellipse_875" data-name="Ellipse 875" transform="translate(293.835 -34.084)">
        <g id="Group_3612" data-name="Group 3612" transform="translate(0.028 0.009)">
          <circle
            id="Ellipse_901"
            data-name="Ellipse 901"
            cx="5.823"
            cy="5.823"
            r="5.823"
            transform="translate(0 0)"
            fill="none"
          />
        </g>
        <g id="Group_3613" data-name="Group 3613">
          <path
            id="Path_4854"
            data-name="Path 4854"
            d="M303.346-22.411a5.843,5.843,0,0,1-5.837-5.837h.8a5.046,5.046,0,0,0,5.041,5.041,5.047,5.047,0,0,0,5.041-5.041,5.047,5.047,0,0,0-5.041-5.041,5.058,5.058,0,0,0-4.375,2.535l-.69-.4a5.856,5.856,0,0,1,5.065-2.934,5.843,5.843,0,0,1,5.837,5.837A5.843,5.843,0,0,1,303.346-22.411Z"
            transform="translate(-297.509 34.084)"
            fill="#45b5ee"
          />
        </g>
      </g>
      <g id="Ellipse_876" data-name="Ellipse 876" transform="translate(292.509 -31.431)">
        <g id="Group_3614" data-name="Group 3614" transform="translate(0 0.064)">
          <ellipse
            id="Ellipse_902"
            data-name="Ellipse 902"
            cx="1.851"
            cy="1.806"
            rx="1.851"
            ry="1.806"
            fill="none"
          />
        </g>
        <g id="Group_3615" data-name="Group 3615" transform="translate(0)">
          <path
            id="Path_4855"
            data-name="Path 4855"
            d="M294.366-20.37a1.859,1.859,0,0,1-1.857-1.857,1.859,1.859,0,0,1,1.857-1.857,1.859,1.859,0,0,1,1.857,1.857A1.859,1.859,0,0,1,294.366-20.37Zm0-2.653a.8.8,0,0,0-.8.8.8.8,0,0,0,.8.8.8.8,0,0,0,.8-.8A.8.8,0,0,0,294.366-23.023Z"
            transform="translate(-292.509 24.084)"
            fill="#fff"
          />
        </g>
      </g>
      <g id="Ellipse_878" data-name="Ellipse 878" transform="translate(292.509 -31.431)">
        <g id="Group_3616" data-name="Group 3616" transform="translate(0 0.064)">
          <ellipse
            id="Ellipse_903"
            data-name="Ellipse 903"
            cx="1.851"
            cy="1.806"
            rx="1.851"
            ry="1.806"
            fill="none"
          />
        </g>
        <g id="Group_3617" data-name="Group 3617" transform="translate(0)">
          <path
            id="Path_4856"
            data-name="Path 4856"
            d="M294.366-20.37a1.859,1.859,0,0,1-1.857-1.857,1.859,1.859,0,0,1,1.857-1.857,1.859,1.859,0,0,1,1.857,1.857A1.859,1.859,0,0,1,294.366-20.37Zm0-2.653a.8.8,0,0,0-.8.8.8.8,0,0,0,.8.8.8.8,0,0,0,.8-.8A.8.8,0,0,0,294.366-23.023Z"
            transform="translate(-292.509 24.084)"
            fill="#45b5ee"
          />
        </g>
      </g>
      <g id="Ellipse_877" data-name="Ellipse 877" transform="translate(297.284 -30.734)">
        <g id="Group_3618" data-name="Group 3618" transform="translate(0.009)">
          <ellipse
            id="Ellipse_904"
            data-name="Ellipse 904"
            cx="2.483"
            cy="2.573"
            rx="2.483"
            ry="2.573"
            transform="translate(0)"
            fill="#45b5ee"
          />
        </g>
        <g id="Group_3619" data-name="Group 3619" transform="translate(0 0.1)">
          <path
            id="Path_4857"
            data-name="Path 4857"
            d="M313.029-16.043a2.523,2.523,0,0,1-2.52-2.52,2.523,2.523,0,0,1,2.52-2.52,2.523,2.523,0,0,1,2.52,2.52A2.523,2.523,0,0,1,313.029-16.043Zm0-3.714a1.2,1.2,0,0,0-1.194,1.194,1.2,1.2,0,0,0,1.194,1.194,1.2,1.2,0,0,0,1.194-1.194A1.2,1.2,0,0,0,313.029-19.757Z"
            transform="translate(-310.509 21.084)"
            fill="#45b5ee"
          />
        </g>
      </g>
    </g>
  </svg> -->
  <img v-else-if="icon === 'combo-blue' || icon === 'combo'" :src="imageRoute('Combo')"/>

  <!-- ACTIVE ADD CIRCLE -->
  <!-- <svg
    v-else-if="icon === 'active-add-circle'"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 15 15"
  >
    <g id="Group_34" data-name="Group 34" transform="translate(-183 -210)">
      <circle
        id="Ellipse_10"
        data-name="Ellipse 10"
        cx="7.5"
        cy="7.5"
        r="7.5"
        transform="translate(183 210)"
        fill="#1473e6"
      />
      <g id="Plus" transform="translate(187 214)">
        <line
          id="Line_4"
          data-name="Line 4"
          y2="6.709"
          transform="translate(3.354)"
          fill="none"
          stroke="#fff"
          stroke-linecap="round"
          stroke-width="2"
        />
        <line
          id="Line_5"
          data-name="Line 5"
          y2="6.709"
          transform="translate(6.709 3.354) rotate(90)"
          fill="none"
          stroke="#fff"
          stroke-linecap="round"
          stroke-width="2"
        />
      </g>
    </g>
  </svg> -->
  <img v-else-if="icon === 'active-add-circle'" :src="imageRoute('ActiveAdd')"/>

  <!-- INACTIVE ADD CIRCLE -->
  <!-- <svg
    v-else-if="icon === 'inactive-add-circle'"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 15 15"
  >
    <g id="Group_35" data-name="Group 35" transform="translate(-183 -210)" opacity="0.505">
      <circle
        id="Ellipse_10"
        data-name="Ellipse 10"
        cx="7.5"
        cy="7.5"
        r="7.5"
        transform="translate(183 210)"
        fill="#eaeaea"
      />
      <g id="Plus" transform="translate(187 214)">
        <line
          id="Line_4"
          data-name="Line 4"
          y2="6.709"
          transform="translate(3.354)"
          fill="none"
          stroke="#b3b3b3"
          stroke-linecap="round"
          stroke-width="2"
        />
        <line
          id="Line_5"
          data-name="Line 5"
          y2="6.709"
          transform="translate(6.709 3.354) rotate(90)"
          fill="none"
          stroke="#b3b3b3"
          stroke-linecap="round"
          stroke-width="2"
        />
      </g>
    </g>
  </svg> -->
  <img v-else-if="icon === 'inactive-add-circle'" :src="imageRoute('InactiveAdd')"/>

  <!-- PLUS -->
  <!-- <svg v-else-if="icon === 'plus'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 142.179 142.179">
    <g id="Group_3652" data-name="Group 3652" transform="translate(0 0)">
      <path 
        id="Union_14" 
        data-name="Union 14" 
        d="M-3632.716-2248.815l-.259-37.642-37.567.257c-10.012.07-18.2-6.962-18.276-15.714l0-.119c0-8.687,8.019-15.769,18-15.839l37.634-.259-.251-36.59c-.071-10.012,6.969-18.2,15.72-18.276,8.648-.162,15.887,7.962,15.958,17.994l.25,36.653,36.595-.252c10.012-.07,18.2,6.97,18.276,15.72.163,8.647-7.962,15.888-17.994,15.958l-36.66.25.256,37.573c.071,10.013-6.961,18.2-15.714,18.277l-.119,0C-3625.564-2230.821-3632.645-2238.84-3632.716-2248.815Z" 
        transform="translate(3688.821 2373)" 
        fill="#989898"
      />
    </g>
  </svg> -->
  <img v-else-if="icon === 'plus'" :src="imageRoute('Plus')"/>

  <!-- MINUS -->
  <!-- <svg v-else-if="icon === 'minus'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7.905 1.885">
    <path
      id="Icon_awesome-minus"
      data-name="Icon awesome-minus"
      d="M7.34,14.625H.565A.6.6,0,0,0,0,15.253v.628a.6.6,0,0,0,.565.628H7.34a.6.6,0,0,0,.565-.628v-.628A.6.6,0,0,0,7.34,14.625Z"
      transform="translate(0 -14.625)"
      fill="#989898"
    />
  </svg> -->
  <img v-else-if="icon === 'minus'" :src="imageRoute('ActiveMinus')"/>

  <!-- LINK -->
  <!-- <svg
    v-else-if="icon === 'link'"
    id="Icon_awesome-link"
    data-name="Icon awesome-link"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 9.5 9.5"
  >
    <path
      id="Icon_awesome-link-2"
      data-name="Icon awesome-link"
      d="M6.06,3.44a2.819,2.819,0,0,1,.007,3.982l-.007.007L4.813,8.675A2.82,2.82,0,0,1,.825,4.687L1.513,4a.3.3,0,0,1,.506.2,3.419,3.419,0,0,0,.18.978.3.3,0,0,1-.07.308l-.243.243a1.336,1.336,0,1,0,1.877,1.9L5.011,6.379a1.336,1.336,0,0,0,0-1.889,1.39,1.39,0,0,0-.192-.159A.3.3,0,0,1,4.69,4.1a.739.739,0,0,1,.217-.553L5.3,3.153a.3.3,0,0,1,.382-.032,2.829,2.829,0,0,1,.381.319ZM8.675.825a2.823,2.823,0,0,0-3.989,0L3.44,2.072l-.007.007a2.821,2.821,0,0,0,.387,4.3A.3.3,0,0,0,4.2,6.347l.391-.391A.739.739,0,0,0,4.81,5.4a.3.3,0,0,0-.129-.234,1.39,1.39,0,0,1-.192-.159,1.336,1.336,0,0,1,0-1.889L5.736,1.874a1.336,1.336,0,1,1,1.877,1.9l-.243.243a.3.3,0,0,0-.07.308,3.419,3.419,0,0,1,.18.978.3.3,0,0,0,.506.2l.688-.688a2.823,2.823,0,0,0,0-3.989Z"
      transform="translate(0 0)"
      fill="#989898"
    />
  </svg> -->
  <img v-else-if="icon === 'link'" :src="imageRoute('Link')"/>

  <!-- UNLINK -->
  <!-- <svg v-else-if="icon === 'unlink'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9.209 9.209">
    <path
      id="Icon_awesome-unlink"
      data-name="Icon awesome-unlink"
      d="M5.469,7.3a.216.216,0,0,1,0,.305l-.8.8A2.734,2.734,0,0,1,.8,4.543l.8-.8a.216.216,0,0,1,.305,0l.712.712a.216.216,0,0,1,0,.305l-.8.8A1.3,1.3,0,0,0,3.648,7.392l.8-.8a.216.216,0,0,1,.305,0ZM4.452,2.62a.216.216,0,0,0,.305,0l.8-.8A1.3,1.3,0,0,1,7.392,3.648l-.8.8a.216.216,0,0,0,0,.305l.712.712a.216.216,0,0,0,.305,0l.8-.8A2.734,2.734,0,0,0,4.543.8l-.8.8a.216.216,0,0,0,0,.305l.712.712ZM8.676,9.083l.407-.407a.432.432,0,0,0,0-.61L1.144.126a.432.432,0,0,0-.61,0L.126.533a.432.432,0,0,0,0,.61L8.065,9.083a.432.432,0,0,0,.61,0Z"
      transform="translate(0 0)"
      fill="#989898"
    />
  </svg> -->
  <img v-else-if="icon === 'unlink'" :src="imageRoute('Unlink')"/>

  <!-- TRIANGLE POINT RIGHT -->
  <!-- <svg
    v-else-if="icon === 'triangle-point-right'"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 6 7"
  >
    <path
      id="Polygon_2"
      data-name="Polygon 2"
      d="M3.5,0,7,6H0Z"
      transform="translate(6) rotate(90)"
      fill="#666"
    />
  </svg> -->
  <img v-else-if="icon === 'triangle-point-right' || icon === 'leftArrow'" :src="imageRoute('PointRight')"/>

  <!-- TRIANGLE POINT DOWN -->
  <!-- <svg
    v-else-if="icon === 'triangle-point-down'"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 7 6"
  >
    <path
      id="Polygon_18"
      data-name="Polygon 18"
      d="M3.5,0,7,6H0Z"
      transform="translate(7 6) rotate(180)"
      fill="#666"
    />
  </svg> -->
  <img v-else-if="icon === 'triangle-point-down' || icon === 'downArrow'" :src="imageRoute('PointDown')"/>

  <!-- PENCIL -->
  <!-- <svg v-else-if="icon === 'pencil'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9.885 8.743">
    <g id="Group_3629" data-name="Group 3629" transform="translate(-156.161 -349.233)">
      <line
        id="Line_1487"
        data-name="Line 1487"
        x1="1.734"
        y1="2.16"
        transform="translate(162.571 350.73)"
        fill="none"
        stroke="#5ecdd6"
        stroke-miterlimit="10"
        stroke-width="1.3"
      />
      <path
        id="Path_4798"
        data-name="Path 4798"
        d="M217.09,86.189l-6.026,4.838a.39.39,0,0,0-.141.245l-.216,1.408a.39.39,0,0,0,.362.449l1.417.088a.391.391,0,0,0,.269-.085l6.026-4.838a1.349,1.349,0,0,0,.207-1.9h0A1.349,1.349,0,0,0,217.09,86.189Z"
        transform="translate(-53.89 264.109)"
        fill="none"
        stroke="#989898"
        stroke-miterlimit="10"
        stroke-width="1.3"
      />
    </g>
  </svg> -->
  <img v-else-if="icon === 'pencil'" :src="imageRoute('Pencil')"/>

  <!-- UPLOAD -->
  <!-- <svg v-else-if="icon === 'upload'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8.235 10">
    <path
      id="Icon_material-file-upload"
      data-name="Icon material-file-upload"
      d="M9.853,12.147h3.529V8.618h2.353L11.618,4.5,7.5,8.618H9.853ZM7.5,13.324h8.235V14.5H7.5Z"
      transform="translate(-7.5 -4.5)"
      fill="#989898"
    />
  </svg> -->
  <img v-else-if="icon === 'upload'" :src="imageRoute('Upload')"/>

  <!-- EYE -->
  <!-- <svg v-else-if="icon === 'eye'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9.273 6.182">
    <path
      id="Icon_awesome-eye"
      data-name="Icon awesome-eye"
      d="M9.217,7.356A5.164,5.164,0,0,0,4.637,4.5,5.165,5.165,0,0,0,.056,7.356a.521.521,0,0,0,0,.47,5.164,5.164,0,0,0,4.581,2.856A5.165,5.165,0,0,0,9.217,7.826.521.521,0,0,0,9.217,7.356ZM4.637,9.909A2.318,2.318,0,1,1,6.955,7.591,2.318,2.318,0,0,1,4.637,9.909Zm0-3.864a1.534,1.534,0,0,0-.407.061A.77.77,0,0,1,3.152,7.184,1.542,1.542,0,1,0,4.637,6.046Z"
      transform="translate(0 -4.5)"
      fill="#989898"
    />
  </svg> -->
  <img v-else-if="icon === 'eye'" :src="imageRoute('InactiveEye')"/>

  <!-- TRASH -->
  <!-- <svg v-else-if="icon === 'trash'" viewBox="0 0 114.47 144">
    <g id="Group_3637" data-name="Group 3637" transform="translate(-33.175 -41.229)">
      <g id="Rectangle_3196" data-name="Rectangle 3196" transform="translate(37.07 78.126)">
        <path id="Path_4894" data-name="Path 4894" d="M129.536,161.093H46.067a11.557,11.557,0,0,1-11.545-11.542V65.535A11.557,11.557,0,0,1,46.067,53.99h83.469a11.557,11.557,0,0,1,11.542,11.545v84.015A11.556,11.556,0,0,1,129.536,161.093ZM46.067,65.515h-.012l-.012,84.035,83.492.023.02-84.038Z" transform="translate(-34.522 -53.99)" fill="#fff" />
      </g>
      <g id="Path_4789" data-name="Path 4789" transform="translate(67.71 41.229)">
        <path id="Path_4895" data-name="Path 4895" d="M90.4,56.886H82.458c0-3.227-7.4-7.711-14.7-7.711s-14.7,4.485-14.7,7.711H45.119c0-8.96,11.953-15.657,22.643-15.657S90.4,47.925,90.4,56.886Z" transform="translate(-45.119 -41.229)" fill="#52bec9" />
      </g>
      <g id="Line_1479" data-name="Line 1479" transform="translate(58.903 105.947)">
        <path id="Path_4896" data-name="Path 4896" d="M47.856,112.387a5.781,5.781,0,0,1-5.783-5.783V69.395a5.783,5.783,0,1,1,11.566,0V106.6A5.783,5.783,0,0,1,47.856,112.387Z" transform="translate(-42.073 -63.612)" fill="#b0b4c0" />
      </g>
      <g id="Line_1481" data-name="Line 1481" transform="translate(84.474 106.181)">
        <path id="Path_4897" data-name="Path 4897" d="M56.7,112.234a5.783,5.783,0,0,1-5.783-5.783V69.476a5.783,5.783,0,0,1,11.566,0v36.975A5.783,5.783,0,0,1,56.7,112.234Z" transform="translate(-50.917 -63.693)" fill="#b0b4c0" />
      </g>
      <g id="Line_1484" data-name="Line 1484" transform="translate(33.175 55.139)">
        <path id="Path_4898" data-name="Path 4898" d="M141.862,57.606H38.958a5.783,5.783,0,1,1,0-11.566h102.9a5.783,5.783,0,1,1,0,11.566Z" transform="translate(-33.175 -46.04)" fill="#fff" />
      </g>
    </g>
  </svg> -->
  <img v-else-if="icon === 'trash'" :src="imageRoute('InactiveTrash')"/>

  <!-- ACCOUNT -->
  <!-- <svg v-else-if="icon === 'account'" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 9.872 10.733">
    <g id="Group_5890" data-name="Group 5890" transform="translate(-584.91 -361.356)">
      <g id="Ellipse_1023" data-name="Ellipse 1023" transform="translate(587.446 361.356)" fill="#a0a0a0" stroke="#a0a0a0" stroke-width="1">
        <circle cx="2.462" cy="2.462" r="2.462" stroke="none"/>
        <circle cx="2.462" cy="2.462" r="1.962" fill="none"/>
      </g>
      <g id="Path_5130" data-name="Path 5130" transform="translate(585.128 366.914)" fill="#a0a0a0">
        <path d="M 4.315008640289307 4.675165176391602 C 1.905151844024658 4.675165176391602 0.6389058828353882 4.526591777801514 0.2930389046669006 4.412384033203125 C 0.2415118515491486 4.153987407684326 0.3342812061309814 3.341577529907227 0.8916088342666626 2.468724966049194 C 1.465068817138672 1.570604920387268 2.590738773345947 0.5000049471855164 4.69675874710083 0.5000049471855164 C 6.947888851165771 0.5000049471855164 8.093118667602539 1.78513491153717 8.575408935546875 2.551184892654419 C 9.108541488647461 3.397965908050537 9.194344520568848 4.138029098510742 9.144408226013184 4.375699996948242 C 8.70618724822998 4.50841236114502 6.905645370483398 4.675165176391602 4.315008640289307 4.675165176391602 Z" stroke="none"/>
        <path d="M 4.69675874710083 0.9999947547912598 C 3.378129005432129 0.9999947547912598 2.332008838653564 1.457695007324219 1.587449073791504 2.360384941101074 C 1.087207794189453 2.966872930526733 0.865203857421875 3.613418579101562 0.8007297515869141 4.007561683654785 C 1.36865234375 4.091233730316162 2.520219802856445 4.175154685974121 4.315038681030273 4.175154685974121 C 6.332749843597412 4.175154685974121 7.898746967315674 4.070186138153076 8.62909984588623 3.966735363006592 C 8.556281089782715 3.587637662887573 8.328858375549316 2.973317861557007 7.839168548583984 2.386985063552856 C 7.310718536376953 1.754245042800903 6.336578845977783 0.9999947547912598 4.69675874710083 0.9999947547912598 M 4.69675874710083 -5.245208740234375e-06 C 8.98694896697998 -5.245208740234375e-06 10.15601921081543 4.29842472076416 9.47260856628418 4.77585506439209 C 9.113796234130859 5.026512145996094 6.652631282806396 5.175156593322754 4.315035820007324 5.175156593322754 C 2.200275897979736 5.175156593322754 0.1867332458496094 5.053568363189697 -0.07909107208251953 4.77585506439209 C -0.6387710571289062 4.191154956817627 0.4065589904785156 -5.245208740234375e-06 4.69675874710083 -5.245208740234375e-06 Z" stroke="none" fill="#a0a0a0"/>
      </g>
    </g>
  </svg> -->
  <img v-else-if="icon === 'account'" :src="imageRoute('Account')"/>

  <!-- LEFT ARROW -->
  <!-- <svg v-else-if="icon === 'leftArrow'" 
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 6.282 9.298"
  >
    <g id="Chevron" transform="translate(6.282) rotate(90)">
      <rect id="Frame" width="9" height="6" transform="translate(0.298)" fill="#a0a0a0" opacity="0"/>
      <path id="Shape" d="M9.3.941A.931.931,0,0,0,7.715.28L4.657,3.34,1.6.28A.933.933,0,0,0,.28,1.6L4,5.309a.931.931,0,0,0,1.317,0L9.035,1.6A.931.931,0,0,0,9.3.941Z" transform="translate(-0.007 0.7)" fill="#a0a0a0"/>
    </g>
  </svg> -->

  <!-- DOWN ARROW -->
  <!-- <svg v-else-if="icon === 'downArrow'" 
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 9.298 5.575"
  >
    <path 
      id="Shape"
      d="M9.3.941A.931.931,0,0,0,7.715.28L4.657,3.34,1.6.28A.933.933,0,0,0,.28,1.6L4,5.309a.931.931,0,0,0,1.317,0L9.035,1.6A.931.931,0,0,0,9.3.941Z"
      transform="translate(-0.007 -0.007)"
      fill="#a0a0a0"
    />
  </svg> -->

  <!-- GREEN CHECK CIRCLE -->
  <!-- <svg
    v-else-if="icon === 'green-check-circle'"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 14.029 14.029"
  >
    <path
      id="Icon_awesome-check-circle"
      data-name="Icon awesome-check-circle"
      d="M14.592,7.577A7.015,7.015,0,1,1,7.577.562,7.015,7.015,0,0,1,14.592,7.577ZM6.766,11.291l5.2-5.2a.453.453,0,0,0,0-.64l-.64-.64a.453.453,0,0,0-.64,0L6.446,9.051,4.464,7.07a.453.453,0,0,0-.64,0l-.64.64a.453.453,0,0,0,0,.64l2.942,2.942a.453.453,0,0,0,.64,0Z"
      transform="translate(-0.563 -0.563)"
      fill="#5ed575"
    />
  </svg> -->
  <img v-else-if="icon === 'green-check-circle'" :src="imageRoute('Check')"/>
  
  <!-- BACK ARROW CIRCLE -->
  <img v-else-if="icon === 'back-arrow'" :src="imageRoute('BackArrow')"/>
</template>

<script>
export default {
  name: "IconBase",
  props: {
    icon: {
      type: String,
      required: true
    }
  },
  methods: {
    imageRoute(fileName) {
      return `src/asset/images/temp_icons/${fileName}.png`
    }
  },
};
</script>

<style scoped>
</style>