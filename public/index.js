let coronaDE = $.ajax({
  url: "mapde-env.eba-wemmzmm9.eu-central-1.elasticbeanstalk.com/data",
  dataType: "json",
  success: console.log("Corona data successfully loaded."),
  error: function (xhr) {
    alert(xhr.statusText)
  }
})

$.when(coronaDE).done(() => {
  let map = L.map('mapid').setView([51.505, 10.27], 6);

  L.tileLayer('https://api.maptiler.com/maps/bright/{z}/{x}/{y}.png?key=p2muKqp8PhaAAjVF7kqL', {
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    tilesize: 512,
    maxZoom: 18
  }).addTo(map);

  let corona = L.geoJSON(coronaDE.responseJSON, {
    style: function () {
      return {
        fillOpacity: 0.5,
        opacity: 0.7,
        weight: 0.3,
        color: "#fff"
      }
    },
    onEachFeature: function (feature, layer) {
      popupOptions = {
        maxWidth: 300
      };
      layer.bindPopup('<b>' + layer.feature.properties.GEN + '</b><br><p>' + "Cases: " + layer.feature.properties.cases + '</p><p>' + "Deaths: " + layer.feature.properties.deaths + '</p>');
      layer.bindTooltip(layer.feature.properties.GEN);

      layer.setStyle({
        fillColor: getFillColor(parseInt(layer.feature.properties.cases7_per_100k)),
        color: "#000"
      });

    }

  });

  corona.on("mouseover", (e) => {
    selected = e.layer;
    console.log(selected.feature.properties.cases7_per_100k);
    console.log(selected.options);
    initialStyle = selected.options.fillOpacity;
    selected.setStyle({
      fillOpacity: 0.8
    });
  })

  corona.on("mouseout", (e) => {
    e.layer.setStyle({
      fillOpacity: initialStyle
    });

  })

  corona.addTo(map);

});

function getFillColor(caseCount) {
  return caseCount == 0 ? 'gray' :
    caseCount < 35 ? '#FEF001' :
    caseCount < 50 ? '#FFCE03' :
    caseCount < 100 ? '#FD6104' :'#F00505';
}