---
tags:
  - map/photo-location
icon: camera
Type:
Country:
Region:
location:
best_time:
Done: false
Parent: "[[Photo Locations]]"
Source:
publish: true
image: "[[image-11.webp]]"
color: blue
---

```mapview
{"name":"Current Note","query":"path:\"$filename$\"","chosenMapSource":0,"autoFit":true,"lock":true,"showLinks":true,"linkColor":"red","markerLabels":"off"}
```

## Description

%%What is this spot about%%

## Photography Tips

%%Advice about this photo location%%

## Travel Information

%%How can you get there, parking availability%%

`= choice(startswith(string(default(this.image, "")), "[["), "!" + this.image, choice(this.image, "![Image](" + this.image + ")", "No Image"))`
