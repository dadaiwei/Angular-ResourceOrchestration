app.filter("pageFilter", function(){
    return function(contents, index, entry){
        return contents.slice(index * entry, (index + 1) * entry);
    }
})
