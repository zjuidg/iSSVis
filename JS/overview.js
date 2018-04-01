class mainOverview {
    constructor() {
        this.div = d3.select("#OVERVIEW");
        this.div_height = parseInt(this.div.style("height").split("p")[0]);
        this.svg_overview = this.div.append("svg").attr("id", "svg_overview").style("width", "100%").style("height", "100%");
        this.svg_overview_g = this.svg_overview.append("g").attr("id", "svg_overview_g");
        
        this.height_high = 6;
        this.height_middle = 20;
        this.high_or_middle = "high";
        if(this.high_or_middle == "high"){
            this.svg_overview.style("height", timeline.infoArray.length*this.height_high + 50);
        }
        else{
            this.svg_overview.style("height", timeline.infoArray.length*this.height_middle + 50);
        }
        
        this.scroll_width = 0;
        this.scroll_r = this.scroll_width/2;

        this.svg_overview_width = parseInt(this.div.style("width").split("p")[0]);
        this.svg_overview_height = parseInt(this.svg_overview.style("height").split("p")[0]);
        this.column_gap = 5;
        this.column_width =  (this.svg_overview_width - this.column_gap * 4 - this.scroll_width) / 3;
        this.top = 0;
        this.r = 5;
        this.scroll = 0;
        // this.change_mode();
        this.paint();


    }
    change_mode(){
        if(this.high_or_middle == "high"){
            this.svg_overview.style("height", timeline.infoArray.length*this.height_high+ 50);
        }
        else{
            this.svg_overview.style("height", timeline.infoArray.length*this.height_middle+ 50);
        }
        this.svg_overview_height = parseInt(this.svg_overview.style("height").split("p")[0]);
        this.svg_overview_g.selectAll("*").remove();

        this.paint();

    }
    paint(){

        let this_ = this;

        
        this_.scroll_height = this_.div_height/this_.svg_overview_height*this_.div_height;

        this_.g_back = this_.svg_overview_g.append("g").attr("id", "back");
        this_.g_high_level = this_.svg_overview_g.append("g").attr("id", "high_level");
        this_.g_middle_level = this_.svg_overview_g.append("g").attr("id", "middle_level");

        this_.g_back.append("rect")//left
        .attr("id", "back_rect")
        .attr("class", "overview back_rect normal")
        .attr("x", this_.column_gap)
        .attr("y", this_.top)
        .attr("width", this_.column_width)
        .attr("height", this_.svg_overview_height-50);

        this_.g_back.append("rect")//middle
        .attr("id", "back_rect")
        .attr("class", "overview back_rect normal")
        .attr("x", this_.column_gap + this_.column_width + this_.column_gap)
        .attr("y", this_.top)
        .attr("width", this_.column_width)
        .attr("height", this_.svg_overview_height-50);

        this_.g_back.append("rect")//right
        .attr("id", "back_rect")
        .attr("class", "overview back_rect normal")
        .attr("x", this_.column_gap + (this_.column_width + this_.column_gap)*2)
        .attr("y", this_.top)
        .attr("width", this_.column_width)
        .attr("height", this_.svg_overview_height-50);

        let g_high_level = this_.g_high_level.selectAll("g")
        .data(timeline.infoArray)
        .enter().append("g")
        .attr("id", function(d,i){return "_" + i;});


        g_high_level.append("line")
            .attr("class", function(d,i){
                let rally_seq = d["stroke_context"]["rally_seq"];
                let rally = d["stroke_context"]["rally"]
                return `overview front_line player${rally[rally_seq]["hitplayer"]}`
            })
            .attr("x1", function(d,i){
                let rally_seq = d["stroke_context"]["rally_seq"];
                let rally = d["stroke_context"]["rally"];

                let ballpos = rally[rally_seq]["ballpos"];
                if (ballpos == -1){
                    return this_.column_gap + this_.column_width + this_.column_gap + this_.column_width/2;
                }
                let tmp_x = ballpos%3;
                return this_.column_gap + tmp_x * (this_.column_width + this_.column_gap) + this_.column_width/2;
               
            })
            .attr("y1", function(d,i){
                return i*(this_.height_high) + this_.top + this_.height_high/2;
            })
            .attr("x2", function(d,i){
                let rally_seq,
                    rally;
                if (timeline.num_player == 1||((timeline.num_player == 2)&&(i/2.0 >= timeline.shorter_length))){
                    if(i + 1 >= timeline.infoArray.length){
                        return 0;
                    }
                    rally_seq = timeline.infoArray[i+1]["stroke_context"]["rally_seq"];
                    rally = timeline.infoArray[i+1]["stroke_context"]["rally"];
                }
                else{
                    if(i + 2 >= timeline.infoArray.length){
                        return 0;
                    }
                    rally_seq = timeline.infoArray[i+2]["stroke_context"]["rally_seq"];
                    rally = timeline.infoArray[i+2]["stroke_context"]["rally"];
                }

                let ballpos = rally[rally_seq]["ballpos"];
                if (ballpos == -1){
                    return this_.column_gap +  this_.column_width + this_.column_gap + this_.column_width/2;
                }
                let tmp_x = ballpos%3;
                return this_.column_gap + tmp_x * (this_.column_width + this_.column_gap) + this_.column_width/2;
               
            })
            .attr("y2", function(d,i){
                if(timeline.num_player == 1||((timeline.num_player == 2)&&(i/2.0 >= timeline.shorter_length))){
                    return (i+1)*(this_.height_high) + this_.top + this_.height_high/2;
                }
                return (i+2)*(this_.height_high) + this_.top + this_.height_high/2; 
            })
            .attr("visibility", function(d,i){
                let rally_seq ;
                let rally ;


                if (timeline.num_player == 1||((timeline.num_player == 2)&&(i/2.0 >= timeline.shorter_length))){
                    if(i + 1 >= timeline.infoArray.length){
                        return "hidden";
                    }
                }
                else{
                    if(i + 2 >= timeline.infoArray.length){
                        return "hidden";
                    }
                }

                return "visible";
            })

        let g_middle_level = this_.g_middle_level.selectAll("g")
        .data(timeline.infoArray)
        .enter().append("g")
        .attr("id", function(d,i){return "_" + i;});

        g_middle_level.append("line")
            .attr("class", function(d,i){
                let rally_seq = d["stroke_context"]["rally_seq"];
                let rally = d["stroke_context"]["rally"]
                return `overview front_line player${rally[rally_seq]["hitplayer"]}`
            })
            .attr("x1", function(d,i){
                let rally_seq = d["stroke_context"]["rally_seq"];
                let rally = d["stroke_context"]["rally"];

                let ballpos = rally[rally_seq]["ballpos"];
                if (ballpos == -1){
                    return this_.column_gap + this_.column_width + this_.column_gap + this_.column_width/2;
                }
                let tmp_x = ballpos%3;
                return this_.column_gap + tmp_x * (this_.column_width + this_.column_gap) + this_.column_width/2;
               
            })
            .attr("y1", function(d,i){
                return i*(this_.height_middle) + this_.top + this_.height_middle/2;
            })
            .attr("x2", function(d,i){
                let rally_seq,
                    rally;
                if (timeline.num_player == 1||((timeline.num_player == 2)&&(i/2.0 >= timeline.shorter_length))){
                    if(i + 1 >= timeline.infoArray.length){
                        return 0;
                    }
                    rally_seq = timeline.infoArray[i+1]["stroke_context"]["rally_seq"];
                    rally = timeline.infoArray[i+1]["stroke_context"]["rally"];
                }
                else{
                    if(i + 2 >= timeline.infoArray.length){
                        return 0;
                    }
                    rally_seq = timeline.infoArray[i+2]["stroke_context"]["rally_seq"];
                    rally = timeline.infoArray[i+2]["stroke_context"]["rally"];
                }

                let ballpos = rally[rally_seq]["ballpos"];
                if (ballpos == -1){
                    return this_.column_gap  + this_.column_width + this_.column_gap + this_.column_width/2;
                }
                let tmp_x = ballpos%3;
                return this_.column_gap + tmp_x * (this_.column_width + this_.column_gap) + this_.column_width/2;
               
            })
            .attr("y2", function(d,i){
                if(timeline.num_player == 1||((timeline.num_player == 2)&&(i/2.0 >= timeline.shorter_length))){
                    return (i+1)*(this_.height_middle) + this_.top + this_.height_middle/2;
                }
                return (i+2)*(this_.height_middle) + this_.top + this_.height_middle/2; 
            })
            .attr("visibility", function(d,i){
                let rally_seq ;
                let rally ;


                if (timeline.num_player == 1||((timeline.num_player == 2)&&(i/2.0 >= timeline.shorter_length))){
                    if(i + 1 >= timeline.infoArray.length){
                        return "hidden";
                    }
                }
                else{
                    if(i + 2 >= timeline.infoArray.length){
                        return "hidden";
                    }
                }
                return "visible";
            })

        g_middle_level.append("circle")
            .attr("class", function(d,i){
                let rally_seq = d["stroke_context"]["rally_seq"];
                let rally = d["stroke_context"]["rally"]

                let ballpos = rally[rally_seq]["ballpos"];
                let tech = rally[rally_seq]["tech"];
                if (ballpos == -1){
                    return `main front_fan_sector tech${tech} lose`;
                }
                return `main front_fan_sector tech${tech}`;

                return `overview front_circle player${rally[rally_seq]["hitplayer"]}`
            })
            .attr("cx", function(d,i){
                let rally_seq = d["stroke_context"]["rally_seq"];
                let rally = d["stroke_context"]["rally"];

                let ballpos = rally[rally_seq]["ballpos"];
                if (ballpos == -1){
                    return this_.column_gap + this_.column_width + this_.column_gap + this_.column_width/2;
                }
                let tmp_x = ballpos%3;
                return this_.column_gap + tmp_x * (this_.column_width + this_.column_gap) + this_.column_width/2;
               
            })
            .attr("cy", function(d,i){
                return i*(this_.height_middle) + this_.top + this_.height_middle/2;
            })
            .attr("r", this_.r)


        
        if(this_.high_or_middle == "high"){
            this_.g_high_level.selectAll("*").attr("visibility", "visible");
            this_.g_high_level.selectAll(`g#_${timeline.infoArray.length-1}`).selectAll("line").attr("visibility", "hidden");
            this_.g_middle_level.selectAll("*").attr("visibility", "hidden"); 

            let rect_height = timeline.div_height/(timeline.rect_height + timeline.sma_gap_height)*this_.height_high,
                rect_width = this.svg_overview_width - this.scroll_width,
                rect_x = 0,
                rect_y = this_.top;
                // this.svg_overview_height

            let drag = d3.drag()
            .on("start", function(d,i){
            })
            .on("drag", function(d,i){ 
                console.log(d3.event.y);
                let svg_height =  this_.svg_overview_height,
                    div_height = this_.div_height,
                    whole_length =  svg_height - this_.top - rect_height,
                    current_length,
                    time_svg_height = parseInt(timeline.svg_main.style("height").split("p")[0]);
                d3.select(this).attr("y", function(d,i){ 
                    if(d3.event.y - rect_height/2 < this_.top_gap){
                        return this_.top_gap;
                    }
                    if(d3.event.y + rect_height/2 > svg_height){
                        return svg_height - rect_height;
                    }
                    return d3.event.y - rect_height/2;
                });

                if(d3.event.y < this_.top){
                    current_length =  0;
                }
                else if(d3.event.y + rect_height > svg_height){
                    current_length = whole_length;
                }
                else{
                    current_length =  d3.event.y  - rect_height/2 - this_.top;
                }
                $("#TIMELINE").scrollTop(current_length/whole_length*time_svg_height);
                
            })
            .on('end', function(d,i){

            });
            this_.svg_overview_g.append("rect")
                .attr("id", "slider")
                .attr("class", "overview slide_rect normal")
                .attr("x", rect_x)
                .attr("y", rect_y)
                .attr("width", rect_width)
                .attr("height", rect_height)
                .on("mouseover", function(d,i){
                        d3.select(this).attr("class", "overview slide_rect hover");
                })
                .on("mouseout", function(d,i){
                        d3.select(this).attr("class", "overview slide_rect normal");
                })
                .call(drag);
            $("#TIMELINE").scroll(function(){
                this_.scroll = 1;
                let move_y = $(this).scrollTop(),
                    current_length;

                
                let svg_height =  this_.svg_overview_height,
                    div_height = this_.div_height,
                    whole_length =  svg_height - this_.top - rect_height,
                    time_svg_height = parseInt(timeline.svg_main.style("height").split("p")[0]);
                
                current_length = move_y/time_svg_height*whole_length;
                overview.svg_overview_g.select("#slider").attr("y", current_length + this_.top);
                
            }); 

        }
        else{
            this_.g_high_level.selectAll("*").attr("visibility", "hidden");
            this_.g_middle_level.selectAll("*").attr("visibility", "visible"); 
            this_.g_middle_level.selectAll(`g#_${timeline.infoArray.length-1}`).selectAll("line").attr("visibility", "hidden");

            let rect_height = timeline.div_height/(timeline.rect_height + timeline.sma_gap_height)*this_.height_middle,
                rect_width = this.svg_overview_width - this.scroll_width,
                rect_x = 0,
                rect_y = this_.top;
                // this.svg_overview_height

            let drag = d3.drag()
            .on("start", function(d,i){
            })
            .on("drag", function(d,i){ 
                console.log(d3.event.y);
                let svg_height =  this_.svg_overview_height,
                    div_height = this_.div_height,
                    whole_length =  svg_height - this_.top - rect_height,
                    current_length,
                    time_svg_height = parseInt(timeline.svg_main.style("height").split("p")[0]);
                d3.select(this).attr("y", function(d,i){ 
                    if(d3.event.y - rect_height/2 < this_.top_gap){
                        return this_.top_gap;
                    }
                    if(d3.event.y + rect_height/2 > svg_height){
                        return svg_height - rect_height;
                    }
                    return d3.event.y - rect_height/2;
                });

                if(d3.event.y < this_.top){
                    current_length =  0;
                }
                else if(d3.event.y + rect_height > svg_height){
                    current_length = whole_length;
                }
                else{
                    current_length =  d3.event.y  - rect_height/2 - this_.top;
                }
                $("#TIMELINE").scrollTop(current_length/whole_length*time_svg_height);
                
            })
            .on('end', function(d,i){

            });
            this_.svg_overview_g.append("rect")
                .attr("id", "slider")
                .attr("class", "overview slide_rect normal")
                .attr("x", rect_x)
                .attr("y", rect_y)
                .attr("width", rect_width)
                .attr("height", rect_height)
                .on("mouseover", function(d,i){
                        d3.select(this).attr("class", "overview slide_rect hover");
                })
                .on("mouseout", function(d,i){
                        d3.select(this).attr("class", "overview slide_rect normal");
                })
                .call(drag);
            $("#TIMELINE").scroll(function(){
                this_.scroll = 1;
                let move_y = $(this).scrollTop(),
                    current_length;

                
                let svg_height =  this_.svg_overview_height,
                    div_height = this_.div_height,
                    whole_length =  svg_height - this_.top - rect_height,
                    time_svg_height = parseInt(timeline.svg_main.style("height").split("p")[0]);
                
                current_length = move_y/time_svg_height*whole_length;
                overview.svg_overview_g.select("#slider").attr("y", current_length + this_.top);
                
            }); 
        }

        
            
    }

}