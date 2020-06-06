
function populateDashbView(){
    $.getJSON("/config/dashbViews.json", function(viewsObj) {
        dashbViews = viewsObj;
        configSliders = dashbViews.main.sliders;
        configSliders.forEach(param=>addSliderToView(param));
        configCharts = dashbViews.main.charts;
        configCharts.map(name=>addChartToView(name));
        activateD3();
        activateCustomization();
    });
}

function addSliderToView(param,edit=false){
    if(variables[param]){
        let meta = variables[param].meta,
            groupId = "sliderId"+variables[param].index,
            col = $("<div>").addClass("col d-flex align-items-stretch").attr("id",groupId),
            sliderGroup = $("<div>").addClass("sliderGroup d-flex align-items-start flex-column justify-content-center"),
            label = $("<label>").attr('for', param).html("<strong>"+param+"</strong>").addClass("mb-auto mx-auto"),
            slider = $('<input type="range">').addClass("io-slider-slide mx-auto").attr("name",param).attr("value",meta.value).attr("min",meta.min).attr("max",meta.max).attr("step",meta.step), // here here here
            output = $("<div>").addClass("mx-auto").html(`&nbsp&nbsp<span class="unit">${meta.unit}</span>`).prepend($('<span>').addClass("io-slider-box mx-auto").attr("name",param).html(slider.attr('value')));
            deleter = $("<img>").addClass("deleter editMode").attr("src","/img/icons/add.svg").click(()=>{deleteThis(groupId);});
        if (!edit){deleter.addClass("hidden");}
        sliderGroup.append(label).append(output).append(slider).append(deleter);
        col.append(sliderGroup);
        $(".slidersDiv .row").prepend(col);
    }else{
        configSliders.splice(configSliders.indexOf(param),1);
    }
}

function addChartToView(name,edit=false){
    if(variables[name]){
        let groupId = "chartId"+variables[name].index,
            chart = $('<div>').addClass("io-chart io-chart-style").attr("name",name).attr("varname",name).attr("xaxisname",variables['INITIAL TIME'].meta.unit).attr("yaxisname",variables[name].meta.unit),
            deleter = $("<img>").addClass("deleter editMode").attr("src","/img/icons/add.svg").click(()=>{deleteThis(groupId);}),
            col = $("<div>").addClass("col").attr("id",groupId).append(chart).append(deleter); 
        if (!edit){deleter.addClass("hidden");}
        $(".chartsDiv .row").prepend(col);
    }else{
        configCharts.splice(configCharts.indexOf(name),1);
    }
}



