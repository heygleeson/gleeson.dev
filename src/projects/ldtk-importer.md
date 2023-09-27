---
title: LDTK Importer
icon: ldtk-logo.svg
tags: [godot, github, tool]
---

<!-- <img class="project-icon" src="/img/projects/ldtk-logo.svg"> -->

[LDtk](https://ldtk.io/) importer for [Godot 4](https://godotengine.org/)

![](https://img.shields.io/badge/Godot-4.0%2B-%20?logo=godotengine&color=%23478CBF) ![](https://img.shields.io/badge/LDtk%201.3.4-%20?color=%23FFCC00)

## Quickstart

1. [Download the latest release]()
2. Unpack `/ldtk-importer/` into the `'/addons/` folder in your Godot project.
3. Enable this plugin in `Project > Project Settings > Plugins`

- [x] Handle EntityRefs
- [ ] World Layer Support
- [ ] Entity Stuff

## Features

### World
- Imports '.ldtk' files as Scenes

### Level
- Imports level background images
- Parses Level Fields into Godot types

### Layer
- Generates TileMaps from all LDtk tile layer types (Tiles, IntGrid, AutoLayer)
- Supports LDtk Tilemap layers of different grid sizes
- Creates `Node2Ds` for Entity layers, to be handled later (by Placeholders or a Post-Import script)

### Tilesets
- Generates Atlases from LDtk Tilesets
- **Supports flipped tiles**
- Supports importing tilesets as CanvasTextures, allowing for usage of [normal maps]().
- Allows for further editing of TileSets in the Editor, preserving changes (Physics Layers, Render Layers, etc.)
- Supports Tile Custom Data (must be parsed by a post-import script)

### Entities
- Can create EntityPlaceholders
- Parses Entity Fields into Godot types
- **Handles EntityRefs**

## Import Options 

With the `.ldtk` file selected in the `FileViewer` dock, navigate to the `Import` dock to view the following Import Settings:

- **Level**
	- Import All Levels: 
- **Tileset**
	- Tileset Custom Data: Add tile custom data to Tiles
	- Atlas Texture Type: Co
- **Entity**
	- Entity Placeholders:
- **Post Import**
	- World Post Import:
	- Level Post Import:
	- Tileset Post Import:
	- Entity Post Import:

### Tile Custom Data

LDtk allows you to add custom data to individual tiles in any given tileset.

> This data can either be numbers, text, JSON, XML, etc. Basically, any tile related info you would like to pass to you game engine.

## Post-Import

You can hook up custom scripts that run during importing that modify the resulting Scene. Currently, there are 4 points where a post-import can be inserted, in order of execution:
- **TileSet:** supplies an Array of generated TileSets
- **Entity:** supplies a `Node2D` containing 'entities' metadata.
- **Level:** supplies a `LDTKLevel` node containing TileMaps, Backgrounds(Sprite2D) and Entities(Node2D) nodes.
- **World:** supplies the `LDTKWorld` containing all `LDTKLevel` nodes.

Example post-import scripts are included to cover common use cases; feel free to edit/expand on them to suit your project.


### Post-Import: Tilesets
```gdscript
@tool

func post_import(tilesets: Dictionary) -> Dictionary:

	# Behaviour goes here

	return tilesets
```


### Post-Import: Entity Layer

> When "use_entity_placeholders" is disabled, entity instances are stored as Node2D metadata.

```gdscript
@tool

func post_import(entity_layer: Node2D) -> Node2D:
	var entities: Array
	
	if entity_layer.has_meta('entities'):
		entities = entity_layer.get_meta('entities')
	else:
		entities = entity_layer.get_children().filter(
			func(node):
				return node is LDTKEntity
		)

	for entity in entities:

		# Perform operations here
		pass

	return entity_layer

```


### Post-Import: Level
```gdscript
@tool

func post_import(level: LDTKLevel) -> LDTKLevel:

	# Behaviour goes here

	return level
```

### Post-Import: World
```gdscript
@tool

func post_import(world: LDTKWorld) -> LDTKWorld:

	# Behaviour goes here

	return world
```

## FAQ

### How do I add tileset collisions?

While it is possible to add tileset collisions via a post-import script, this plugin is designed so that it is easy to manually edit the generated TileSets inside the project directly - reimporting the LDtk file will preserve these changes.

1. Open the generated TileSet (e.g. `tilesets/Tileset16x16.res`)
2. In the Inspector, add a Physics Layer
3. In the `TileSet` pane, select the `TileSetAtlasSource` and go to the `Select` view.
4. Open the `Physics` submenu and select the created `Physics Layer`.
4. Add collision polygons to each individual tile as necessary

>TIP: A quick way to do this is to click+drag to select multiple tiles, and press `[F]` to use the default tile shape.

### How do I add tilemap normals?

1. Under `Import Options`, make sure you have selected `Atlas Texture Type` to `Canvas Texture`
2. Open the generated TileSet (e.g. `tilesets/Tileset16x16.res`)
3. In the `Tileset` pane, select the `TileSetAtlasSource` go to the `Setup` view
4. Select `Texture`, and add the corresponding normal map.

## Special Thanks
- [amano-ldtk](https://github.com/afk-mario/amano-ldtk-importer) for original inspiration