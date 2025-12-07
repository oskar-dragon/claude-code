---
tags:
  - map/accommodation/campsite
Country:
Region:
location:
Source:
publish: true
image:
color: blue
icon: tent-tree
---

```mapview
{"name":"Current Note","query":"path:\"$filename$\"","chosenMapSource":0,"autoFit":true,"lock":true,"showLinks":true,"linkColor":"red","markerLabels":"off"}
```

## Description

%%What is this spot about%%

## Travel Information

%%How can you get there, parking availability%%

`= choice(startswith(string(default(this.image, "")), "[["), "!" + this.image, choice(this.image, "![Image](" + this.image + ")", "No Image"))`
