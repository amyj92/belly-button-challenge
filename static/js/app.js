// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;
    console.log("Metadata:", metadata);   // Log the entire metadata

    // Filter the metadata for the object with the desired sample number
    let result = metadata.filter(sampleNumber => sampleNumber.id == sample)[0];
    console.log("Filtered metadata for sample:", result);   // Log the filtered result

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });

  });
}


// Function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;
    console.log("Samples data:", samples);    // Log the entire samples data

    // Filter the samples for the object with the desired sample number
    let result = samples.filter(sampleNumber => sampleNumber.id == sample)[0];
    console.log("Filtered sample data for sample:", result);    // Log the filtered sample result

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;

    // Log the extracted OTU data
    console.log("OTU IDs:", otu_ids);
    console.log("OTU Labels:", otu_labels);
    console.log("Sample Values:", sample_values);

    // Build a Bubble Chart
    let bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    };
    let bubbleData = [bubbleTrace];

    // Render the Bubble Chart
    let bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Number of Bacteria' },
      hovermode: 'closest'
    };
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otu_ids.map(id => `OTU ${id}`).slice(0, 10).reverse();
    console.log("Y-ticks for Bar Chart:", yticks);    // Log the y-ticks

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barTrace = {
      x: sample_values.slice(0, 10).reverse(),
      y: yticks,
      text: otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
    }; 
    let barData = [barTrace];

    // Render the Bar Chart
    let barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      margin: { l: 100, r: 100, t: 100, b: 100 },
      xaxis: { title: 'Number of Bacteria' }
    };
    Plotly.newPlot('bar', barData, barLayout);

  });
}


// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;
    console.log("Sample names:", names);    // Log the sample names

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu = d3.select("#selDataset");
    
    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach(name => {
      dropdownMenu.append("option").text(name).property("value", name);
      console.log("Added option for sample:", name);    // Log each added sample option
    });

    // Get the first sample from the list
    let firstSample = names[0];
    console.log("First sample selected:", firstSample);   // Log the first sample selected

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);

  });
}


// Function for event listener
function optionChanged(newSample) {
  console.log("Sample changed to:", newSample);   // Log the new sample selected
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();