function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

  //Open Display [0] Volunteer
  optionChanged(data.names[0]);
})}

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
  console.log(newSample);
}

init();

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    PANEL.append("h6").text(`ID: ${result.id}`);
    PANEL.append("h6").text(`Ethnicity: ${result.ethnicity}`);
    PANEL.append("h6").text(`Gender: ${result.gender}`);
    PANEL.append("h6").text(`Age: ${result.age}`);
    PANEL.append("h6").text(`Location: ${result.location}`);
    PANEL.append("h6").text(`BBType: ${result.bbtype}`);
    PANEL.append("h6").text(`WFreq: ${result.wfreq}`);
  });    
}

//Build the Charts
function buildCharts(sample) {
  d3.json("samples.json").then((data) => {

  //Filter data for the selected ID
  var samples = data.samples;
  var resultArray = samples.filter(obj => obj.id == sample)[0];

  //Create list of objects for bacteria
  var testArray = [];
  var numValues = resultArray.otu_ids.length;
  for (i=0; i<numValues; i++) {
      testArray.push({
          otu_id: resultArray.otu_ids[i],
          sample_value: resultArray.sample_values[i],
          otu_label: resultArray.otu_labels[i]
      })
  }

  //Sort in decencing orders and create Top 10
  var sortedArray = testArray.sort((a,b) => b.sample_value - a.sample_value);
  var slicedArray = sortedArray.slice(0,10);

  //Map list of objects to create arrays
  var lst_otuid = slicedArray.map(i => ("OTU " +i.otu_id)).reverse();
  var lst_samplevalues = slicedArray.map(i => i.sample_value).reverse();
  var lst_otulabel = slicedArray.map(i => i.otu_label).reverse();

  var barDataset = {
      x: lst_samplevalues,
      y: lst_otuid,
      type: "bar",
      orientation: "h",
      text: lst_otulabel
  };

  var layout = {
      title: "Top 10 Bacteria"
  }
  
  //Build Bar Chart
  Plotly.newPlot("bar",[barDataset], layout);

  //Map list of objects to create arrays
  var lst_otuid = testArray.map(i => i.otu_id);
  var lst_samplevalues = testArray.map(i => i.sample_value);
  var lst_otulabel = testArray.map(i => i.otu_label);


  //Build Bubble Chart
  var bubbleDataset = {
      x: lst_otuid,
      y: lst_samplevalues,
      text: lst_otulabel,
      mode: 'markers',
      marker: {
          color: lst_otuid,
          size: lst_samplevalues,
          colorscale: "Earth"
      }
      };
  
  
  var layout = {
      title: "Bacteria Count Frequency",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Bacteria Count"},
      height: 550,
      width: 1250
      };
      
  Plotly.newPlot('bubble', [bubbleDataset], layout);
  });

}

