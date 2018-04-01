class mainTop_Overview {
    constructor() {
        this.div_ = d3.select("#TOP_OVERVIEW");
        this.svg = this.div_.append("svg").attr("id", "svg_top_overview").style("width","180%").style("height","100%");
        this.svg_width = parseInt(this.div_.style("width").split("p")[0])*(1-0.06);
        this.svg_height = parseInt(this.div_.style("height").split("p")[0]);
        // console.log(this.svg_left_width);
        
        if(1){//TITLE
            this.TITLE_pos = {"x0":0, 
                              "y0": 0, 
                              "width":this.svg_width*1.5, 
                              "height":this.svg_height*0.7 };
            let pos = this.TITLE_pos;
            this.TITLE_frame = {"left": 0, 
                                "right": 0, 
                                "top": 0.05 * pos.height, 
                                "bottom":  0.05 * pos.height}
            let frame = this.TITLE_frame;
            this.TITLE = {};
            this.TITLE.x0 = pos.x0 + frame.left;
            this.TITLE.y0 = pos.y0 + frame.top;
            this.TITLE.width = pos.width - frame.left - frame.right;
            this.TITLE.height = pos.height - frame.top - frame.bottom;
            this.TITLE.fz = this.TITLE.height * 0.5;
            this.TITLE.r = this.TITLE.height / 2;
        }
        
        if(1){//top
            this.top_pos = {"x0":0, 
                            "y0": this.TITLE_pos.y0 + this.TITLE_pos.height, 
                            "width":this.svg_width, 
                            "height":this.svg_height*0.3 };
            let pos = this.top_pos;
            this.top_frame = {"left": 0.02 * pos.width,
                              "right": 0.02 * pos.width,
                              "top": 0.05 * pos.height,
                              "bottom": 0.05 * pos.height }
            let frame = this.top_frame;
            this.top = {};
            this.top.x0 = pos.x0 + frame.left;
            this.top.y0 = pos.y0 + frame.top;
            this.top.width = pos.width - frame.left - frame.right;
            this.top.height = pos.height - frame.top - frame.bottom;

            this.top.gap = 0.2 * this.top.height;
            this.top.but_width = (this.top.width - 2*this.top.gap)/3; 
            this.top.but_height = this.top.height;
            this.top.r = 0.2 * this.top.but_height;
            this.top.fz = this.top.but_height*0.5;
            this.top.but_nl = ["B","M","F"];
        }

        this.paint_top_overview();
    }

    paint_top_overview(){
        let this_ = this;
       
        //title
        if(1){
            let title = this_.TITLE;

            this_.svg.append("path")
            .attr("class", "top back_rect")
            .attr("d", function (d,i){
                return `M ${title.x0} ${title.y0} L ${title.x0 + title.width} ${title.y0} A ${title.r} ${title.r} 0 0 1 ${title.x0 + title.width} ${title.y0 + title.height} L ${title.x0} ${title.y0 + title.height} z`
            });
            this_.svg
            .append("svg:text")
            .attr("class", "top back_text")
            .attr("x", title.x0 + title.width/2 +title.r/2)
            .attr("y", title.y0 + title.height/2)
            .style("font-size", title.fz )
            .text("iTTVis-2.0")
        }
        
        //top
        if(1){
            let top = this_.top;
            for (let i = 0; i < 3; i++){
                this_.svg.append("rect")
                .attr("class", "top back_rect")
                .attr("x", top.x0 + i*(top.gap+top.but_width))
                .attr("y", top.y0 )
                .attr("width", top.but_width)
                .attr("height", top.but_height)
                .attr("rx", top.r)
                .attr("ry", top.r);
                this_.svg.append("svg:text")
                .attr("class", "top back_text")
                .attr("x", top.x0 + i*(top.gap+top.but_width) + top.but_width/2)
                .attr("y", top.y0 + top.but_height/2)
                .style("font-size", top.fz)
                .text(top.but_nl[i]);
            }
        }

        // .on("click", function(d,i){
        //     if(overview.high_or_middle == "high"){
        //         overview.high_or_middle = "middle";
        //         overview.change_mode();
        //     }
        //     else{
        //         overview.high_or_middle = "high";
        //         overview.change_mode();
        //     }
        // });


    }
    
   
}