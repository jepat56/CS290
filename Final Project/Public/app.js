function deleteRow(ID,rowIndex) {
    
        var table = document.getElementById(ID);
        var rowCount = table.rows.length;
        
        for (var i = 0; i < rowCount; i++) 
        {
            var row = table.rows[i];
            
            if (row==rowIndex.parentNode.parentNode) {
                if (rowCount <= 1) 
                {
        
                    break;
                }
                table.deleteRow(i);
                rowCount--;
                i--;
            }
        }
    
}

function deleteRow(){
    var id = this.id;
    var req = new XMLHttpRequest();
    var link = "http://localhost:45685/delete?id=";
    req.open("GET", link + id, true);
            req.addEventListener("load", function(){
            if(req.status >= 200 && req.status < 400)
            {
                var node = document.getElementById(id);
                
                    if(node.parentNode)
                    {
                        node.parentNode.removeChild(node);
                    }
            }
            else
            {
                console.log("Error in network request");
            }
        
        });

        req.send(JSON.stringify(req.responseText));
        event.preventDefault();
}

function edit(id) {
    var edited;
    edited = document.getElementById(id);
    edited.style.display = edited.style.display === "none" ? "block" : "none";
}
