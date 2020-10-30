// var geojson = {"type": "FeatureCollection","features": [{"type": "Feature","properties": {},"geometry": {"type": "LineString","coordinates": [[6.65771484375,50.62507306341435],[6.9873046875,50.51342652633956],[7.3828125,50.62507306341435],[7.55859375,50.86144411058924],[7.470703125,51.138001488062564]]}},{"type": "Feature","properties": {},"geometry": {"type": "Polygon","coordinates": [[[7.71240234375,50.52739681329302],[8.349609375,50.317408112618686],[8.525390625,50.61113171332364],[7.998046875,50.98609893339354],[7.71240234375,50.52739681329302]]]}},{"type": "Feature","properties": {"marker-color": "#7e7e7e","marker-size": "medium","marker-symbol": ""},"geometry": {"type": "Point","coordinates": [7.646484374999999,51.481382896100975]}}]};
// L.geoJSON(geojson).addTo(mymap);

let coronaDE = $.ajax({
  url: "http://localhost:3000/data",
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
    style: function (layer) {
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