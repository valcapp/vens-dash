
readVarStarted = false;
setInterval(function(){
    if (VensimLoadedFlag == 0){
        return;
    }else if (!readVarStarted) {
        readVars();
        initConst();
        
    }
},100);

function initConst(){
    if (c0there){
        $.getJSON("/config/c0.json",function(data){
            c0 = data;
        });
    }else{
        c0 = {};
        constants.map((c)=>{
            c0[c]=GetValueAtTime(c,t0);
        });
    }
    populateDashbView();
}

function populateDashbView(){
    $.getJSON("/config/dashbViews.json", function(viewsObj) {
        dashbViews = viewsObj;
        configSliders = dashbViews.main.sliders;
        configSliders.forEach(param=>addSliderToView(param));
        configCharts = dashbViews.main.charts;
        configCharts.map(name=>addChartToView(name));
        activateD3();
        populateRuns();
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

function populateRuns(){
    // check if the json exists
    // you need to get the object first from json
    $.getJSON("/config/dashbRuns.json", function(runsObj) {
        dashbRuns = runsObj;

        // console.log(dashbRuns);
        for (let runName in dashbRuns){
            runModelWithParams(runName,dashbRuns[runName]);
        }

        let modal = $('.deleteRunModal .modal-body');
        Object.keys(dashbRuns).forEach((run,i)=>{
            let div = $('<div class="form-check">'),
                checkbox = $('<input type="checkbox" class="form-check-input">').attr("id",i).attr("name",run).appendTo(div),
                label = $('<label class="form-check-label">').attr('for',i).html(run).appendTo(div);
            modal.append(div);
        });
    });

}


