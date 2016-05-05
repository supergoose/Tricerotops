/*global Utils*/ //Make sure to import Utils

var Renderer = 
{
    canvas: null,
    ctx: null,
    screenwidth:0,
    screenheight:0,
    screendepth:1024,
    increment:0,
    
    initialisation: function(canv)
    {
        this.canvas = canv;
        
        this.screenwidth = this.canvas.width;
        this.screenheight = this.canvas.height;
        
        this.ctx = this.canvas.getContext("2d");
    },
    
    clearscreen: function()
    {
        this.ctx.clearRect(0, 0, this.screenwidth, this.screenheight);  
    },
    
    //Pass this a homogenous coordinate and an amount to translate it by as 3 vars (x,y,z)
    translate: function(matrix, tx, ty, tz)
    {
        var translationMatrix = [
            [1,0,0,tx],
            [0,1,0,ty],
            [0,0,1,tz],
            [0,0,0,1]
            ];
            
        
        
        var result = Utils.multiplyMatrices(matrix, translationMatrix);
        return result;
    },
    
    rotate : function(point, rotx, roty, rotz)
    {
        var cx = Math.cos(rotx);
        var sx = Math.sin(rotx);
        var cy = Math.cos(roty);
        var sy = Math.sin(roty);
        var cz = Math.cos(rotz);
        var sz = Math.sin(rotz);
        
        var rotationMatrixX = [
            [1,0,0,1],
            [0,cx,sx,0],
            [0,-sx,cx,0],
            [0,0,0,1]
            ];
        
        var rotationMatrixY = [
            [cy,0,-sy,0],
            [0,1,0,0],
            [sy,0,cy,0],
            [0,0,0,1]
            ];
            
        var rotationMatrixZ = [
            [cz,sz,0,0],
            [-sz,cz,0,0],
            [0,0,1,0],
            [0,0,0,1]
            ];
        
        var result = Utils.multiplyMatrices(point, rotationMatrixX);
        result = Utils.multiplyMatrices(result, rotationMatrixY);
        result = Utils.multiplyMatrices(result, rotationMatrixZ);
        
        return result;
    },
    
    project: function(point)
    {
        //screen space is 1024, 768, 768
        
        
        var p = new Array();
        /*
        p[0] = point[0]/this.screenwidth;
        p[1] = point[1]/this.screenheight;
        p[2] = point[2]/this.screendepth;
        
        */
        var projectionMatrix = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 1/200],
            [0, 0, 1, 0]
            ];
        
        console.log("old p: " + point);
        p = Utils.multiplyMatrices(point, projectionMatrix);
        console.log("new p: " + p);
        
        p[0] = p[0]/p[3];
        p[1] = p[1]/p[3];
        p[2] = p[2]/p[3];
        p[3] = p[3]/p[3];
        
        p[0] = p[0]/p[2];
        p[1] = p[1]/p[2];
        p[2] = p[2]/p[2];
        
        return p;
    },
    
    modelToWorldSpace: function(point)
    {
        return [point[0]+this.screenwidth/2, point[1]+this.screenheight/2];
    },
    
    render: function(vertices, triangleList)
    {
        console.log("Drawing...");
        this.clearscreen();
        this.increment--;
        for(var i = 0; i < triangleList.length; i++)
        {
            var projectedTriangleList = new Array();
            var projectedTriangle = new Array();
            for(var j = 0; j < 3; j++)
            {
                var point = vertices[triangleList[i][j]];
                point = this.translate(point, 0,0,this.increment);
                console.log("projecting..." + point);
                point = this.project(point);
                console.log("end projection: " + point);
                point = this.modelToWorldSpace(point);
                
                projectedTriangle[j] = point;
                
            }
            this.drawTriangle(projectedTriangle);
        }
        
    },
    
    drawTriangle: function(points) //Takes a 2d point array of 3 points
    {
        this.ctx.beginPath();
        this.ctx.fillStyle = "red";
        this.ctx.moveTo(points[0][0],points[0][1]);
        this.ctx.lineTo(points[1][0], points[1][1]);
        this.ctx.lineTo(points[2][0], points[2][1]);
        this.ctx.lineTo(points[0][0], points[0][1]);
        this.ctx.stroke();
        //this.ctx.fill();
        this.ctx.closePath();
    }
}