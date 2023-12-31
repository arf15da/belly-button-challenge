const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

//pull the demographic info pair from metadata base on the sample on init
function demograph_data(sample) {
    d3.json(url).then((data) => {
        let metadata = data.metadata;
        let resultarray = metadata.filter(x => x.id == sample) 
        //filter for the argument sample to match with id
        let result = resultarray[0]
        let table = d3.select("#sample-metadata")
        table.html("") 
        //clear the data on the table
        //for (key in result) {table.append("h6").text(`${key}: ${result[key]}`)
        //}
        Object.entries(result).forEach(([key, value]) => {
            table.append("h6").text(`${key}: ${value}`)
        })

    })

}
// plot the sample data from samples base on the sample on init
function plot_data(sample) {
    d3.json(url).then((data) => {
        let sampledata = data.samples;
        let resultarray = sampledata.filter(x => x.id == sample)
        let result = resultarray[0]
        let otu_ids = result.otu_ids
        let sample_value = result.sample_values
        let otu_labels = result.otu_labels

        // Bar Chart
        var bar = {
            x: sample_value.slice(0, 10).reverse(),
            y: otu_ids.slice(0, 10).map(otu_ids => ` OTU ${otu_ids}`).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        };
        var data = [bar];
        var layout = {
            title: "Top Ten OTUs of " + sample,
        };
        Plotly.newPlot("bar", data, layout);


        // Bubble Chart
        var bubble = {
            x: otu_ids,
            y: sample_value,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_value,
                color: otu_ids,
                colorscale: "jet"
            }
        };
        var data = [bubble];
        var layout = {
            xaxis: { title: "OTU ID " + sample },

        };
        Plotly.newPlot('bubble', data, layout);

    })

}

// create a function init to display the data
function init() {
    let selector = d3.select("#selDataset")
    d3.json(url).then((data) => {
        let names = data.names
        names.forEach((sample) => {
            selector.append("option").text(sample).property("value", sample)

        })
        let firstSample = names[0]
        demograph_data(firstSample)
        plot_data(firstSample)

    })
}
init()

// create a function to update base on optionChanged event
function optionChanged(newSample) {
    demograph_data(newSample)
    plot_data(newSample)
}