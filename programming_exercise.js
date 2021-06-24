console.log('hello');

InputJson = [{
        "name": "Watches 1",
        "id": 5,
        "parent_id": 4
    },
    {
        "name": "Watches 2",
        "id": 4,
        "parent_id": 3
    },
    {
        "name": "Accessories",
        "id": 3,
        "parent_id": 2
    },
    {
        "name": "Men",
        "id": 2,
        "parent_id": 1
    },
    {
        "name": "Ties 1",
        "id": 1,
        "parent_id": null,
    },
    {
        "name": "Ties 2",
        "id": 10,
        "parent_id": 9,
    },
    {
        "name": "Ties 3",
        "id": 9,
        "parent_id": null,
    },
];

// Define Output
let properJsonOutput = [];
// `existOutputIdList` could also be get by other way like `arr1.forEach(value=>console.log(value.id))`
// It takes more space to make  `existOutputIdList` independent from properJsonOutput but could save some time.
// But ideally searching in list would be faster than search in the nodes.However, no matter which way we adopt, it's not matter a lot to time complexity.
let existOutputIdList = [];


// Get the length of JSON
let InputJsonLength = InputJson.length;
// If we want to think detailed about big(O), it's more clear and easy to apply for loop, instead of other method like `forEach` 
for (let i = 0; i < InputJsonLength; i++) {

    let currentItem = InputJson[i];
    let currentItem_id = currentItem.id;
    let currentItem_parent_id = currentItem.parent_id;

    // After running deep search, `InputJson[i]`` item may already be put into `properJsonOutput`
    // IE does not support `includes`, but it's fine if we do this in the backend
    let currentItem_in_output = existOutputIdList.includes(currentItem_id); // TIMECOMPLEXITY: O(N1)
    let currentItem_has_parent_in_output = existOutputIdList.includes(currentItem.parent_id); // TIMECOMPLEXITY: O(N1)


    if (currentItem_in_output == false) {
        // We don't need to include currentID while searching for parents by slicing array
        let remainInputItems = InputJson.slice(i + 1, InputJsonLength); 
        // we need a tempstack to store those items who haven't have parents in their dict
        let tempStack = [];

        // Validated items may have no parent root (null), or their parents have already in the output
        // if currentItem is not validated, search its parent till the validated one.
        while (!(currentItem_parent_id == null || currentItem_has_parent_in_output == true)) {

            // find ParentItem
            let parentItem = remainInputItems.filter(item => {
                return item.id == currentItem_parent_id;
            })[0];

            // Put Item into the stack
            tempStack.push(currentItem);
            existOutputIdList.push(currentItem_id);

            // Renew Current Item
            currentItem = parentItem;
            currentItem_id = parentItem.id;
            currentItem_parent_id = parentItem.parent_id;
            currentItem_has_parent_in_output = existOutputIdList.includes(parentItem.parent_id);
        };

        // if currentItem is validated item, put it into Outpur
        properJsonOutput.push(currentItem);
        existOutputIdList.push(currentItem_id);
        properJsonOutput=properJsonOutput.concat(tempStack.reverse());
    } else {
        continue;
    }
}

console.log(existOutputIdList);
console.log(properJsonOutput);