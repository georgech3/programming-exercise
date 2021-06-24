# Answer and Thinking Process

## The Answer in JavaScript
### The Deploy Version
```javascript=
module.exports = function sortCategoriesForInsert (inputJson) {

    let properJsonOutput = [];
    let existOutputIdList = [];
    
    let InputJsonLength = InputJson.length;
    for (let i = 0; i < InputJsonLength; i++) {

        let currentItem = InputJson[i];
        let currentItem_id = currentItem.id;
        let currentItem_parent_id = currentItem.parent_id;

        let currentItem_in_output = existOutputIdList.includes(currentItem_id);
        let currentItem_has_parent_in_output = existOutputIdList.includes(currentItem.parent_id);


        if (currentItem_in_output == false) {
            let remainInputItems = InputJson.slice(i + 1, InputJsonLength); 
            let tempStack = [];

            while (!(currentItem_parent_id == null || currentItem_has_parent_in_output == true)) {

                let parentItem = remainInputItems.filter(item => {
                    return item.id == currentItem_parent_id;
                })[0];

                tempStack.push(currentItem);
                existOutputIdList.push(currentItem_id);

                currentItem = parentItem;
                currentItem_id = parentItem.id;
                currentItem_parent_id = parentItem.parent_id;
                currentItem_has_parent_in_output = existOutputIdList.includes(parentItem.parent_id);
            };

            properJsonOutput.push(currentItem);
            existOutputIdList.push(currentItem_id);
            properJsonOutput=properJsonOutput.concat(tempStack.reverse());
        } else {
            continue;
        };
    };
    return properJsonOutput
}
```
- The `bottleneck` of the code is the `while` part, and the time complexity may be O(n^2^) for my algorithm
### The Development Version
```javascript=
// Limitation reference in [Problem](https://bitbucket.org/dbuy/workspace/snippets/rnB4an): 
// 1. Submitted in One file
// 2. Order insensitive for Key-Value pair in JSON 
// 3. Whitespace insensitive
// 4. Extreme Large Situation

// 20210624 @Georgech3
module.exports = function sortCategoriesForInsert (inputJson) {
    // Check Input, we assume input format is validated, including the encoding of the data.
    // In most cases, JSON text shall only be encoded in UTF-8, UTF-16, UTF-32.
    
    // Record Computation Time
    let time_start_algorithm = Date.now() 
    
    // Define Output
    let properJsonOutput = [];
    //  Create a quick check list for items.
    // `existOutputIdList` could also be get by other way like `arr1.forEach(value=>console.log(value.id))`
    // It takes more space to make  `existOutputIdList` independent from properJsonOutput but could save some time.
    // // But ideally searching in a list would be faster than search in the nodes. However, no matter which way we adopt, it does not matter a lot to time complexity.
    let existOutputIdList = [];
    
    

    // Main Algorithm
    // To put it simple, loop every item and find the validated nodes
    // if current item is not validated, put it to temporary stack and search its ancestors untill the validated node
    // Get the length of JSON
    let InputJsonLength = InputJson.length;
    // If we want to think detailed about big(O), it's more clear and easy to apply for loop, instead of other method like `forEach` 
    for (let i = 0; i < InputJsonLength; i++) {

        let currentItem = InputJson[i];
        let currentItem_id = currentItem.id;
        let currentItem_parent_id = currentItem.parent_id;

        // After running deep search, `InputJson[i]`` item may already be put into `properJsonOutput`
        // IE does not support `includes`, but it's fine if we do this in the backend
        let currentItem_in_output = existOutputIdList.includes(currentItem_id); // TC: O(N1)
        let currentItem_has_parent_in_output = existOutputIdList.includes(currentItem.parent_id); // TIMECOMPLEXITY: TC: O(N2)


        if (currentItem_in_output == false) {
            // We don't need to include currentID while searching for parents by slicing array
            let remainInputItems = InputJson.slice(i + 1, InputJsonLength); 
            // we need a tempstack to store those items who haven't have parents in their dict
            let tempStack = [];

            // Validated items may have no parent root (null), or their parents have already in the output
            // if currentItem is not validated, search its parent untill the validated one.
            while (!(currentItem_parent_id == null || currentItem_has_parent_in_output == true)) {

                // find ParentItem 
                let parentItem = remainInputItems.filter(item => {
                    return item.id == currentItem_parent_id;
                })[0]; //TC: O(N1-i) = O(N2)

                // Put Item into the stack
                tempStack.push(currentItem);
                existOutputIdList.push(currentItem_id);

                // Renew Current Item
                currentItem = parentItem;
                currentItem_id = parentItem.id;
                currentItem_parent_id = parentItem.parent_id;
                currentItem_has_parent_in_output = existOutputIdList.includes(parentItem.parent_id); //TC: O(N2)
            }; //TC: O(N1^2^)

            // Remain currentItem is validated item, put it into Outpur
            properJsonOutput.push(currentItem); //TC: O(1)
            existOutputIdList.push(currentItem_id); //TC: O(1)
            properJsonOutput=properJsonOutput.concat(tempStack.reverse()); //TC: O(1)
        } else {
            continue;
        }
    }
    let time_computation_algorithm = Date.now() - time_start_algorithm
    // Print Time or Save
    console.log("Algorithm Computation Time: ",time_computation_algorithm)
    
    // Check Output
    return properJsonOutput
}
```
### Time Complexity
By check time complexity, please search the `TC:` term in the development version.

#### Computation in main algorithm
|          i          |                 `remainInputItems`                 |        max loop times in `while`        |
|:-------------------:|:--------------------------------------------------:|:---------------------------------------:|
| index in `for` loop |       a variable: items havn't been compute        | Equal the length of `remain InputItems` |
|          1          | InputJson[1:] #written in python for comprehension |                   n-1                   |
|          2          |                   InputJson[2:]                   |                   n-2                   |
|          3          |                   InputJson[3:]                   |                   n-3                   |
|        ...          |                   ...                             |                   ...                   |
|          N          |                   InputJson[N:]                   |                   n-N                   |
|        ...          |                   ...                             |                   ...                   |
|  lengthOfInputJson  |                   InputJson[-1]#the last item     |                   0                   |

Then, we can summarize the number from n-1, n-2, n-3, ..., n-N, ...,0
It's a arithmetic progression, so the sum of it is `n(n-1)/2`, equal to (n^2^-n)/2

:::success

So the time complexity of my algorith is O(n^2^)

:::

## My Thinking Process
1. [How many time could we have to solve this Question?](#1-How-many-time-could-we-have-to-solve-this-Question)
2. [Customer Conditions:](#2-Customer-Condition)
    - Why do we need to solve this problem?
    - What's the problem customers meet?
3. [Operational Assumptions](#3-Operational-Assumptions)
4. [Current Environment Situations](#4-Current-Environment-Situations)
5. [Problem Clarification](#5-Problem-Clarification)
    - Problem Description
    - DataType
    - Simplified Question
    - Condition Trees
    - Edge Cases
6. [Algorithm](#6-Algorithm)
    - Brute-force Solution
    - Optimization
7. [Future Work](#7-Future-Work)
    - Maintainability
    - Scability

### 1. How many times could we have to solve this Question?
- Restricted me to answer in one hour as mentioned in the mail.

### 2. Customer Conditions
- User may click a category btn in our website.
### 3. Operational Assumptions
- Goal may be to satisfy user and gain revenue.
- So, how could build the service with best-in-class satisfication?

### 4. Current Environment Situations
- Seems API was not built by GraphQL
- Assume that we can get data successfully
- My Environment
    - Mac OS Catalina v10.15.7
    - Docker v3.3.3
    - Ubuntu v18.04
    - NodeJS v14.4.0

### 5. Problem Clarification
#### 5.1 Problem Description
Database -> Function -> Storefront

- Clean Database (without missing parents)

| CategoryID | ParentCategoryID | CategoryName |
|:----------:|:----------------:|:------------:|
|     1      |        20        | Accessories  |
|     57     |        1         |   Watches    |
|     20     |       null       |     Men      |

- Storefront
#### 5.2 DataType
- Input: Array of Objects
- Output: Array of Objects

#### 5.3 Simplified Question
- How to put nodes in the right sequences?
- How to find the right ancestors and append them sequentially to the output?

#### 5.4 Conditional Trees
For each item:
One. If the item has no parent: Push to output directly.
Two. If the item has parents: check its parent is in the output or not.
- if yes, push to output
- if no, loop to search the node which could be validated to output
    - put the current item to a stack
    - search its parent, repeat procedure Two

:::success
If the item matches conditions One or Two, I defined it as a **validated** item that can be put into `output` directly.
:::
### 6. Algorithm
- Get data without parent (`parent_id==null`)
- Sort all parent ID first 
#### Brainstorming Solution
- What if we sort items first?
    - If we only deal with Sorting Algorithm, then merge sort and quicksort return same time complexity ( *O(n logn)* )
    - However, it still needs to put items according to the sequences of ancestors.
- Create a temporary stack and store items that haven't validated
#### Brute-force Solution
- Think in Python for simplify

```python=
def sort_json(input):
    ancestors_dict = defaultdict(list)
    output = []
    for x in input:
        if x['parent_id']:
            ancestors_dict[x['parent_id']] = x
        else:
            ancestors_dict[x['parent_id']].append(x)
    
    while ancestors_dict[None]:
        tempStack = ancestors_dict[None].pop(0)
        output.append(tempStack)
        while ancestors_dict.get(tempStack['id'], False):
            output.append(ancestors_dict.get(tempStack['id']))
            tempStack = ancestors_dict.get(tempStack['id'])
            
    return(output)
```
#### Optimization
- I think that we could provide some cache
- ( *O(nlogn)* if merge sorting)
//- Actually if think one of the best ways to do 

### 7. Future Work
If we have more time could discuss...

