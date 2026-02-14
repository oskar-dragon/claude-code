# Recipe Creator Plugin

Automates creation of recipe notes in Obsidian from URLs or text with proper formatting, unit conversion to European standards, and automatic macro calculation.

## Features

- ✅ **Create from URL or Text**: Extract recipes from websites or paste recipe data directly
- ✅ **Clean Extraction**: Uses defuddle to remove ads, navigation, and clutter from recipe websites
- ✅ **European Units**: Automatically converts cups, tablespoons, ounces, and pounds to ml/l/g/kg
- ✅ **Macro Calculation**: Estimates calories, protein, carbs, and fat per serving
- ✅ **Smart Classification**: Automatically determines cuisine and recipe type
- ✅ **Obsidian Integration**: Creates properly formatted notes with frontmatter and wikilinks
- ✅ **Image Extraction**: Pulls recipe images from webpage metadata

## Installation

### From Plugin Directory

1. Copy the `recipe-creator` directory to your Claude Code plugins location
2. Enable the plugin in Claude Code settings

### Using Plugin Path

```bash
cc --plugin-dir /path/to/recipe-creator
```

## Prerequisites

This plugin requires the `obsidian-skills` plugin to be installed and enabled, as it delegates to:
- `obsidian:defuddle` - Clean webpage content extraction
- `obsidian:obsidian-markdown` - Obsidian-flavored markdown formatting
- `obsidian:obsidian-cli` - Obsidian vault interactions

## Usage

### Basic Command

```bash
/create-recipe <url-or-recipe-text>
```

### Examples

**From URL:**
```bash
/create-recipe https://cookieandkate.com/crispy-smashed-potatoes-recipe/
```

**From Text:**
```bash
/create-recipe Title: Pasta Carbonara
Ingredients:
- 400g spaghetti
- 200g pancetta
- 4 eggs
- 100g parmesan
Instructions:
1. Cook pasta
2. Fry pancetta
3. Mix eggs and cheese
4. Combine everything
```

## How It Works

The plugin follows this automated workflow:

1. **Determine Input Type**: Identifies if input is URL or raw text
2. **Extract Content**: Uses defuddle skill for URLs to get clean recipe data
3. **Parse Recipe**: Extracts title, ingredients, instructions, servings, image
4. **Convert Units**: Transforms all measurements to European standard (g/kg/ml/l)
   - 1 cup → 240ml
   - 1 tbsp → 15ml
   - 1 lb → 454g
   - 1 oz → 28g
5. **Calculate Macros**: Estimates nutrition per serving using ingredient lookup
6. **Classify**: Determines cuisine and type from built-in taxonomy
7. **Structure Note**: Uses obsidian-markdown skill for proper formatting
8. **Create File**: Uses obsidian-cli skill to create note in Notes/ folder

## Recipe Template

Created recipes follow this structure:

```markdown
---
categories:
  - "[[Recipes]]"
cuisine: Japanese
type:
  - "[[Dinners]]"
author: [Cookie and Kate]
url: https://example.com/recipe
rating:
created: 2026-02-14
last: 2026-02-14
image: https://example.com/image.jpg
this_week:
---
## Ingredients

- 450g chicken breast
- 240ml soy sauce
- 30ml sesame oil

## Directions

- Step 1
- Step 2

## Notes

-

## Nutrition (Per Serving)

- Calories: 450 kcal
- Protein: 35g
- Carbs: 20g
- Fat: 15g

*Based on estimated ingredient values*
```

## Supported Cuisines

The plugin recognizes these cuisines:
- Japanese, Mexican, Turkish, Polish, Thai
- Greek, Middle Eastern, Mediterranean
- Indian, American, Italian, British, French
- Chinese, Korean, Vietnamese, Spanish
- Moroccan, Lebanese, Portuguese, German
- Caribbean, Cajun

## Supported Types

- [[Breakfasts]]
- [[Dinners]]
- [[Desserts]]
- [[Salads]]

## Unit Conversion Reference

| Imperial | Metric |
|----------|--------|
| 1 cup | 240ml |
| 1/2 cup | 120ml |
| 1/4 cup | 60ml |
| 1 tbsp | 15ml |
| 1 tsp | 5ml |
| 1 fl oz | 30ml |
| 1 lb | 454g |
| 1 oz | 28g |

All conversions round to sensible increments (5g, 10ml).

## Macro Calculation

Macros are estimated using a lookup table for common ingredients:

**Proteins (per 100g):**
- Chicken breast: 165 cal, 31g protein, 3.6g fat
- Ground beef: 250 cal, 26g protein, 15g fat
- Eggs: 70 cal, 6g protein, 5g fat

**Carbs (per 100g):**
- Rice (cooked): 130 cal, 28g carbs
- Pasta (cooked): 130 cal, 25g carbs
- Bread: 265 cal, 49g carbs

The calculation is basic estimation only. If precise nutrition is needed, provide exact macros in the recipe text.

## Error Handling

**URL extraction fails:**
- Plugin notifies you and asks if you want to provide recipe text manually

**Incomplete recipe data:**
- Creates note with available information
- Leaves missing sections empty

**Unclear cuisine/type:**
- Only prompts if completely unable to classify
- Otherwise makes best guess based on ingredients and methods

## Files Structure

```
recipe-creator/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest
├── commands/
│   └── create-recipe.md     # Main command
├── templates/
│   └── recipe-template.md   # Note template reference
└── README.md                # This file
```

## Dependencies

- **obsidian-skills plugin** (required)
  - Provides defuddle, obsidian-markdown, and obsidian-cli skills

## Configuration

### Vault Path

The plugin is configured to create notes at:
```
/Users/oskardragon-work/Library/CloudStorage/GoogleDrive-dragon.t.oskar@gmail.com/My Drive/Obsidian/Vault V2/Notes/
```

To use with a different vault, edit the path in `commands/create-recipe.md` at step 9.

### Template Customization

The template at `templates/recipe-template.md` mirrors your vault's recipe template. If you update your vault template, copy the changes here to keep them in sync.

## Troubleshooting

**Command not found:**
- Verify plugin is enabled in Claude Code
- Check plugin is in correct directory

**Obsidian skills not working:**
- Ensure obsidian-skills plugin is installed
- Verify obsidian-skills plugin is enabled

**Wrong vault path:**
- Edit the vault path in `commands/create-recipe.md` line 232

**Units not converting:**
- Check that measurements use standard abbreviations (cup, tbsp, tsp, lb, oz)
- Non-standard units may not convert

## Contributing

This plugin is customized for a specific Obsidian vault structure. To adapt for your vault:

1. Update vault path in command file
2. Modify cuisine/type taxonomy as needed
3. Adjust template to match your frontmatter structure

## Version

Current version: 0.1.0

## License

Personal use plugin
