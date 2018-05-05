class mainTop_Timeline {
    constructor() {
        this.div = d3.select("#TOP_TIMELINE");
        this.svg_top_score = this.div.append("svg").attr("id", "svg_top_score")
        this.svg_top_main = this.div.append("svg").attr("id", "svg_top_main")
        this.svg_top_button = this.div.append("svg").attr("id", "svg_top_button")

        this.svg_height = parseInt(this.div.style("height").split("p")[0])

        this.score_width = parseInt(this.svg_top_score.style("width").split("p")[0])
        this.main_width = parseInt(this.svg_top_main.style("width").split("p")[0])
        this.button_width = parseInt(this.svg_top_button.style("width").split("p")[0])

        this.tactic_mode = 0;

        this.paint_score();
        this.paint_main();
    }

    paint_score(){
        let this_ = this;
        if(1){//score
            this.score_pos = {"x0":0, 
                              "y0": this.svg_height*0.7, 
                              "width":this.score_width, 
                              "height":this.svg_height*0.3 };
            let pos = this.score_pos;
            this.score_frame = {"left": 0, 
                                "right": 0, 
                                "top": 0.05 * pos.height, 
                                "bottom":  0.05 * pos.height}
            let frame = this.score_frame;
            this.score = {};
            this.score.x0 = pos.x0 + frame.left;
            this.score.y0 = pos.y0 + frame.top;
            this.score.width = pos.width - frame.left - frame.right;
            this.score.height = pos.height - frame.top - frame.bottom;
            this.score.fz = this.score.height * 0.5;
            this.score.r = 0.2 *this.score.height ;
        }
        if(1){//score
            let score = this_.score;
            this_.svg_top_score.append("rect")
            .attr("class", "top back_rect")
            .attr("x", score.x0)
            .attr("y", score.y0)
            .attr("width", score.width)
            .attr("height", score.height)
            .attr("rx", score.r)
            .attr("ry", score.r);
            this_.svg_top_score.append("svg:text")
            .attr("class", "top back_text")
            .attr("x", score.x0 + score.width/2)
            .attr("y", score.y0 + score.height/2)
            .style("font-size", score.fz)
            .text("SCORE");
        }
    }
    switch_table(){
        let this_ = this;
        this.svg_top_main
        .selectAll("g#g_table")
        .selectAll("*")
        .attr("xlink:href", function(d,i){
            if(timeline.playerTop == 1){
                return "SRC/image/axis_0.svg";
            }
            return "SRC/image/axis_1.svg";
        });
    }
    paint_main(){
        let this_ = this;

        if(1){//main
            this.main_pos = {"x0":0, 
                             "y0": this.svg_height*0.15, 
                             "width":this.main_width, 
                             "height":this.svg_height*0.85};
            let pos = this.main_pos;
            this.main_frame = {"left": 0, 
                               "right": 0, 
                               "top": 0.01 * pos.height, 
                               "bottom":  0.01 * pos.height};
            let frame = this.main_frame;
            this.main = {};
            this.main.y0 = pos.y0 + frame.top;
            this.main.height = pos.height - frame.top - frame.bottom;
                
                let total_5 = 50*6+4*5+2*20 + 50*6+4*5+2*20 + 85*3+2*8 + 50*6+4*5+2*20 + 50*6+4*5+2*20 + 2*20;//1751
                let total_3 = 50*6+4*5+2*20 + 85*3+2*8 +  50*6+4*5+2*20 + 2*10;//1011, 1751/1011 = 1.73
                this.main.svg_move_width = (50*6+4*5+2*20)/total_5*this.main_width;
                this.main.big_rect_width = this.main_width/total_5*85;
                this.main.sma_rect_width = this.main_width/total_5*50;
                this.main.column_gap_width = this.main_width/total_5*20;
                this.main.big_gap_width = this.main_width/total_5*8;
                this.main.sma_gap_width = this.main_width/total_5*5;

            
            this.main.x0 = this.main.column_gap_width;
            this.main.ll_table = {};
            this.main.l_table = {};
            this.main.m_table = {};
            this.main.r_table = {};
            this.main.rr_table = {};
            this.main.table_array = [];
            this.main.table_array.push(this.main.ll_table);
            this.main.table_array.push(this.main.l_table);
            this.main.table_array.push(this.main.m_table);
            this.main.table_array.push(this.main.r_table);
            this.main.table_array.push(this.main.rr_table);


            this.main.ll_win = {};
            this.main.l_win = {};
            this.main.r_win = {};
            this.main.rr_win = {};
            this.main.win_array = [];
            this.main.win_array.push(this.main.ll_win);
            this.main.win_array.push(this.main.l_win);
            this.main.win_array.push(this.main.r_win);
            this.main.win_array.push(this.main.rr_win);
            for(let i = 0; i < 5; i++){
                let obj = this.main.table_array[i];
                //x0
                if(i <= 2){
                    obj.x0 = this.main.x0 + (this.main.sma_rect_width*6 + this.main.sma_gap_width*4 + this.main.column_gap_width*2)*i;
                } else
                if(i >= 3){
                    obj.x0 = this.main.x0 + (this.main.sma_rect_width*6 + this.main.sma_gap_width*4 + this.main.column_gap_width*2)*(i-1) + this.main.big_rect_width*3 + this.main.sma_rect_width*3 + this.main.big_gap_width*2 + this.main.sma_gap_width*2 + this.main.column_gap_width*2;
                }
                //y0, et.
                if(i == 2){
                    obj.y0 = this.main.y0 + 5;
                    obj.height = this.main.height;
                    obj.width = this.main.big_rect_width*3 + this.main.big_gap_width*2;
                } else
                if(i != 2){
                    obj.y0 = this.main.y0 + this.main.height * 0.48;
                    obj.height = this.main.height * 0.52;
                    obj.width = this.main.sma_rect_width*3 + this.main.sma_gap_width*2;
                }
            }
            for(let i = 0; i < 4; i++){
                let obj = this.main.win_array[i];
                if(i <= 1){
                    obj.x0 = this.main.x0 + this.main.sma_rect_width*3 + this.main.sma_gap_width*2 + this.main.column_gap_width*1 + (this.main.sma_rect_width*6 + this.main.sma_gap_width*4 + this.main.column_gap_width*2)*i;
                } else
                if(i >= 2){
                    obj.x0 = this.main.x0 + this.main.sma_rect_width*3 + this.main.sma_gap_width*2 + this.main.column_gap_width*1 + (this.main.sma_rect_width*6 + this.main.sma_gap_width*4 + this.main.column_gap_width*2)*(i-1) + this.main.big_rect_width*3 + this.main.sma_rect_width*3 + this.main.big_gap_width*2 + this.main.sma_gap_width*2 + this.main.column_gap_width*2;
                }
                obj.y0 = this.main.y0 + this.main.height * 0.48;
                obj.height = this.main.height * 0.52;
                obj.width = this.main.sma_rect_width*3 + this.main.sma_gap_width*2;
                obj.y_gap = 0.1*obj.height;
                obj.x_gap = 0.1*obj.height;
                obj.rect_height = (obj.height - obj.y_gap)/2;
                obj.rect_width = (obj.width - obj.x_gap*2)/3;
                obj.fz = obj.rect_height * 0.5;
            }
        }

        //paint
        let g = this.svg_top_main.append("g").attr("id", "g_top_main");
        let g_table = g.append("g").attr("id", "g_table");
        for(let i = 0; i < 5; i++){
            let obj = this.main.table_array[i];
            console.log(this.main.table_array)
            g_table
            .append("svg:image")
            .attr("xlink:href", function(d,i){
                if(timeline.playerTop == 1){
                    return "SRC/image/axis_0.svg";
                }
                return "SRC/image/axis_1.svg";
            })
            .attr("x", obj.x0)
            .attr("y", obj.y0)
            .attr("width", obj.width)
            .attr("height",obj.height)
            .on("click", function(d,i){
                if(timeline.playerTop == 0){
                    timeline.playerTop = 1;
                }
                else if(timeline.playerTop == 1){
                    timeline.playerTop = 0;
                }
                this_.switch_table();
                timeline.switch_direction();
                top_overview.switch_table();
            });
        }
        for(let i = 0; i < 4; i++){
            let obj = this.main.win_array[i];
            //top
            g
            .append("svg:rect")
            .attr("class", "top back_rect")
            .attr("x", obj.x0)
            .attr("y", obj.y0)
            .attr("width", obj.width)
            .attr("height", obj.rect_height);
            g
            .append("svg:text")
            .attr("class", "top back_text")
            .attr("x", obj.x0 + obj.width/2)
            .attr("y", obj.y0 + obj.rect_height/2)
            .style("font-size", obj.fz)
            .text("Winning Rate")
            //bottom
            let name_ls = ["Tech", "Place", "Pos"];
            for(let j = 0; j < 3; j++){
                g
                .append("svg:rect")
                .attr("class", "top back_rect")
                .attr("x", obj.x0 + j * (obj.rect_width + obj.x_gap))
                .attr("y", obj.y0 + obj.rect_height + obj.y_gap)
                .attr("width", obj.rect_width)
                .attr("height", obj.rect_height);
                g
                .append("svg:text")
                .attr("class", "top back_text")
                .attr("x", obj.x0 + j * (obj.rect_width + obj.x_gap) + obj.rect_width/2)
                .attr("y", obj.y0 + obj.rect_height + obj.y_gap + obj.rect_height/2)
                .style("font-size", obj.fz)
                .text(name_ls[j])

            }
        }

        if(1){//arrow1
            this.arrow_pos = {"x0":this.main.x0 + (this.main.sma_rect_width*6 + this.main.sma_gap_width*4 + this.main.column_gap_width*2)*1, 
                             "y0": this.svg_height*0.15, 
                             "width":this.main_width*0.01, 
                             "height":this.svg_height*0.85};
            let pos = this.arrow_pos;
            this.arrow_frame = {"left": 0, 
                               "right": 0, 
                               "top": 0.01 * pos.height, 
                               "bottom":  0.01 * pos.height};
            let frame = this.arrow_frame;
            this.arrow1 = {};
            this.arrow1.x0 = pos.x0 + frame.left;
            this.arrow1.y0 = pos.y0 + frame.top;
            this.arrow1.width = pos.width - frame.left - frame.right;
            this.arrow1.height = pos.height - frame.top - frame.bottom;
            this.arrow1.rectan_width = this.arrow1.width * 0.5;
            this.arrow1.rectan_height = this.arrow1.height * 0.2;
        }

        if(1){//arrow2
            this.arrow_pos = {"x0":this.main.x0 + (this.main.sma_rect_width*6 + this.main.sma_gap_width*4 + this.main.column_gap_width*2)*2 
            + this.main.big_rect_width*3 + this.main.sma_rect_width*3 + this.main.big_gap_width*2 + this.main.sma_gap_width*2 + this.main.column_gap_width*2 
            + this.main.sma_rect_width*3 + this.main.sma_gap_width*2
            -  this.main_width*0.01,
                             "y0": this.svg_height*0.15, 
                             "width":this.main_width*0.01, 
                             "height":this.svg_height*0.85};
            let pos = this.arrow_pos;
            this.arrow_frame = {"left": 0, 
                               "right": 0, 
                               "top": 0.01 * pos.height, 
                               "bottom":  0.01 * pos.height};
            let frame = this.arrow_frame;
            this.arrow2 = {};
            this.arrow2.x0 = pos.x0 + frame.left;
            this.arrow2.y0 = pos.y0 + frame.top;
            this.arrow2.width = pos.width - frame.left - frame.right;
            this.arrow2.height = pos.height - frame.top - frame.bottom;
            this.arrow2.rectan_width = this.arrow2.width * 0.5;
            this.arrow2.rectan_height = this.arrow2.height * 0.2;
        }
        //paint 
        if(1){
            let obj = this.arrow1;
            let g = this.svg_top_main.append("g")
            .on("mouseover", function(){
                d3.select(this).selectAll("#varying").attr("visibility", "visible");
            })
            .on("mouseout", function(){
                d3.select(this).selectAll("#varying").attr("visibility", "hidden");
            })
            .on("click", function(){
                let g1 = this_.svg_top_main.selectAll("g#g_top_main");
                let g2 = timeline.svg_main.selectAll("g#svg_main_g");
                let x0;
                switch(this_.tactic_mode){
                    case -1:
                        x0 = 0;
                        g1.transition('position').duration(750)
                        .attr("transform", `translate(${x0},0)`);
                        g2.transition('position').duration(750)
                        .attr("transform", `translate(${x0},0)`);
                        this_.tactic_mode += 1;
                        break;
                    case 0:
                        x0 = timeline.svg_main_move_width;
                        g1.transition('position').duration(750)
                        .attr("transform", `translate(${x0},0)`);
                        g2.transition('position').duration(750)
                        .attr("transform", `translate(${x0},0)`);
                        this_.tactic_mode += 1;
                        break;
                    case 1:
                        break;
                } 
            })

            g
            .append("svg:rect")
            .attr("fill", "#FFFFFF")
            .attr("x", obj.x0)
            .attr("y", obj.y0)
            .attr("width", obj.width)
            .attr("height", obj.height)
            .attr("fill-opacity", 0);
            g
            .append("svg:rect").attr("id", "varying")
            .attr("class", "top back_rect")
            .attr("x", obj.x0)
            .attr("y", obj.y0)
            .attr("width", obj.width)
            .attr("height", obj.height)
            .attr("fill-opacity", 0.4)
            .attr("visibility", "hidden");
            g
            .append("svg:path").attr("id", "varying")
            .attr("fill", "#FFFFFF")
            .attr("d", `M ${obj.x0 + (obj.width-obj.rectan_width)/2} ${obj.y0 + (obj.height-obj.rectan_height)/2} 
                L ${obj.x0 + (obj.width-obj.rectan_width)/2 + obj.rectan_width} ${obj.y0 + (obj.height-obj.rectan_height)/2 + obj.rectan_height/2} 
                L ${obj.x0 + (obj.width-obj.rectan_width)/2} ${obj.y0 + (obj.height-obj.rectan_height)/2 + obj.rectan_height} z`
            )
            .attr("visibility", "hidden");

        }
        if(1){
            let obj = this.arrow2;
            let g = this.svg_top_main.append("g")
            .on("mouseover", function(){
                d3.select(this).selectAll("#varying").attr("visibility", "visible");
            })
            .on("mouseout", function(){
                d3.select(this).selectAll("#varying").attr("visibility", "hidden");
            })
            .on("click", function(){
                let g1 = this_.svg_top_main.selectAll("g#g_top_main");
                let g2 = timeline.svg_main.selectAll("g#svg_main_g");
                let x0;
                switch(this_.tactic_mode){
                    case -1:
                        break;
                    case 0:
                        x0 = -timeline.svg_main_move_width;
                        g1.transition('position').duration(750)
                        .attr("transform", `translate(${x0},0)`);
                        g2.transition('position').duration(750)
                        .attr("transform", `translate(${x0},0)`);
                        this_.tactic_mode -= 1;
                        break;
                    case 1:
                        x0 = 0;
                        g1.transition('position').duration(750)
                        .attr("transform", `translate(${x0},0)`);
                        g2.transition('position').duration(750)
                        .attr("transform", `translate(${x0},0)`);
                        this_.tactic_mode -= 1;
                        break;
                } 
            })


            g
            .append("svg:rect")
            .attr("fill", "#FFFFFF")
            .attr("x", obj.x0)
            .attr("y", obj.y0)
            .attr("width", obj.width)
            .attr("height", obj.height)
            .attr("fill-opacity", 0);
            g
            .append("svg:rect").attr("id", "varying")
            .attr("class", "top back_rect")
            .attr("x", obj.x0)
            .attr("y", obj.y0)
            .attr("width", obj.width)
            .attr("height", obj.height)
            .attr("fill-opacity", 0.4)
            .attr("visibility", "hidden");
            g
            .append("svg:path").attr("id", "varying")
            .attr("fill", "#FFFFFF")
            .attr("d", `M ${obj.x0 + (obj.width-obj.rectan_width)/2 } ${obj.y0 + (obj.height-obj.rectan_height)/2 + obj.rectan_height/2}
                L ${obj.x0 + (obj.width-obj.rectan_width)/2 + obj.rectan_width} ${obj.y0 + (obj.height-obj.rectan_height)/2} 
                L ${obj.x0 + (obj.width-obj.rectan_width)/2 + obj.rectan_width} ${obj.y0 + (obj.height-obj.rectan_height)/2 + obj.rectan_height} z`
           )
            .attr("visibility", "hidden");

        }   
    }
}