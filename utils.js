var Utils = 
{
    multiplyMatrices : function(matrixA, matrixB)
    {
        var matrixC = [];
        
        for(var i = 0; i < matrixA.length; i++)
        {
            var iTotal = 0;
            //console.log("Multiplying " + matrixA[i] + " . " + matrixB[i]);
            
            for(var j = 0; j < matrixB.length; j++)
            {
                iTotal+=matrixA[j]*matrixB[i][j];
            }
            
            matrixC[i] = iTotal;
        }
        
        return matrixC;
    }
}