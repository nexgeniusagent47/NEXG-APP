#!/usr/bin/env python3
"""Fill the pre-spec assessment with the observations taken from the reference.

The scaffold ships with zeroed complexity scores and an `unassessed` object class
on purpose: `new_pre_spec_assessment.py` cannot classify a subject, only a human or
agent looking at the image can. This writes that judgment back in, so the
strict-quality gate has real numbers to check instead of placeholders.
"""
import json
import sys
from pathlib import Path

ws = Path(sys.argv[1])
path = ws / "assessment.json"
data = json.loads(path.read_text(encoding="utf-8"))
psa = data["preSpecAssessment"]

psa["objectClass"] = {
    "primaryType": "bell-headed mascot figure",
    "primaryDomain": "hybrid",
    "formLanguage": ["character-like", "hard-surface", "sculptural"],
    "structureKind": ["compound object", "articulated assembly", "layered shell"],
    "motionPotential": ["articulated", "detachable", "whole-object transform"],
    "materialFamilies": ["metal", "plastic", "rubber", "cloth"],
    "notes": (
        "Hybrid: humanoid body plan (arms, legs, gloves, boots, bow tie) carrying a "
        "non-human head that is a hard-surface call bell. The bell is the identity; the "
        "body is a conventional chibi mascot layout. Routes through the character track "
        "for proportions and pose, but the head is authored as object geometry."
    ),
}

psa["complexity"]["scores"] = {
    "silhouetteComplexity": 2,
    "componentCount": 3,
    "hierarchyDepth": 3,
    "repetitionDensity": 2,
    "materialLayerCount": 3,
    "localDetailDensity": 3,
    "occlusionRisk": 2,
    "actionReadinessNeed": 3,
}
psa["complexity"]["estimatedCounts"] = {
    "macroComponents": 6,
    "mesoComponents": 16,
    "microFeatureGroups": 7,
    "materialLayers": 5,
    "repetitionSystems": 3,
}
psa["complexity"]["reasoning"] = [
    "Silhouette 2: outline is a simple rounded stack, but the flared double-ring rim and "
    "the top button interrupt it at two heights.",
    "Component count 3: six macro masses and roughly sixteen meso parts are separately "
    "readable in the artwork (the SVG names them as discrete groups).",
    "Hierarchy depth 3: bell > rim > band > highlight is a genuine three-level nested "
    "structure, as is arm > cuff > glove > finger-seams.",
    "Repetition density 2: paired limbs, gloves, boots, two rim rings, two bow wings, and "
    "three finger seams per glove.",
    "Material layer count 3: gold metal, matte black, cream/ivory, plus gradient-driven "
    "shading and highlight overlays within each.",
    "Local detail density 3: every surface carries gradient shading, rim highlights, "
    "specular arcs, or linework; almost no flat fills remain.",
    "Occlusion risk 2: single front view; the bell, rim and body are rotationally "
    "symmetric and inferable, but the back of the boots, gloves and bow are not.",
    "Action readiness 3: delivered for web and app interactive use, so pivots, sockets "
    "and a tick hook are required rather than optional.",
]
psa["unknownsToResolveBeforeImplementation"] = [
    "Back-of-boot geometry: only the front and outer face of each sneaker is visible.",
    "Glove rear surface: the mitten reads as a rounded solid from the front only.",
    "Bow tie depth: the knot's thickness and the wings' rear fold are not shown.",
    "Whether the bell interior (the hollow under the rim) should be modelled at all.",
]

# Identity-defining details. `kind` comes from the validator's fixed vocabulary and
# `mapsTo.ref` must resolve to a real component id, localFeature id, or material id --
# the gate rejects prose-only details, so every entry below is bound to spec geometry.
details = [
    ("dome-specular-arc", "gloss", "dome-specular-arc",
     "Vertical specular arc up the left of the dome, brightest at ~14% height."),
    ("rim-double-ring", "ridge", "rim-double-ring",
     "Two stacked flared rings; the lower ring is wider and carries a bright top edge."),
    ("rim-highlight-lines", "gloss", "rim-highlight-lines",
     "Two near-horizontal bright lines across each ring at ~8% and ~62% of ring height."),
    ("face-panel-inset", "groove", "face-panel-inset",
     "Black rounded panel inset into the dome with a thick gold bezel border."),
    ("expression-triple-stroke", "linework", "eye-triple-stroke-l",
     "Brows, arch eyes and smile are each drawn as three stacked strokes: black outline, "
     "amber mid, gold core."),
    ("glove-finger-seams", "seam", "glove-finger-seams-l",
     "Three short parallel seams across the back of each mitten."),
    ("cuff-piped-ring", "stitch", "cuff-piped-rings",
     "Three overlapping piped rings at the wrist, each with its own bright top edge."),
    ("boot-gold-panel", "decal", "boot-gold-panel-l",
     "Gold side panel between the cream toe cap and the cream ankle cuff."),
    ("boot-swoosh", "decal", "boot-swoosh-l",
     "Small cream J-shaped curl mark on the gold panel."),
    ("boot-spark", "scratch", "boot-spark-l",
     "Short bright vertical crease spark on the gold panel."),
    ("boot-lace-bars", "fastener", "boot-lace-bars-l",
     "Three short cream bars across the instep, reading as lace anchors."),
    ("sole-wrap", "bevel", "boot-l",
     "Cream sole that wraps up and around the toe, distinct from the gold upper."),
    ("body-sheen", "gloss", "body-sheen",
     "Soft vertical sheen down the left of the sphere, fading by mid-body."),
    ("torso-fold", "contour", "torso-fold",
     "Two shallow chevron folds where the body meets the bow tie."),
    ("button-dome", "gloss", "button-dome-specular",
     "Round gold cap with its own stem, base flare and offset specular."),
    ("expression-ink-outline", "linework", "expression-triple-strokes",
     "Every facial line carries a darker outline stroke behind the gold core."),
]
psa["detailInventory"]["scanMethod"] = "component-zones"
psa["detailInventory"]["targetMinDetails"] = 16
psa["detailInventory"]["details"] = [
    {"id": d[0], "kind": d[1], "mapsTo": {"ref": d[2]}, "description": d[3]}
    for d in details
]
psa["detailInventory"]["note"] = (
    "Enumerated by scanning the named SVG part groups as zones. Every entry maps to a "
    "component.localFeatures or material.localOverrides entry in the spec."
)

psa["anatomy"] = {
    "applies": True,
    "styleHeads": 2.6,
    "proportions": {
        "headUnit": 0.50,
        "torso": 0.22,
        "legs": 0.28,
        "shoulderWidth": 0.34,
        "hipWidth": 0.20,
    },
    "pose": {"type": "standing-neutral", "jointAngles": {"shoulder": 62.0, "elbow": 8.0,
                                                         "hip": 4.0, "knee": 0.0}},
    "faceLandmarks": {
        "eyeLine": 0.63, "eyeSpacing": 0.36, "noseBase": 0.0,
        "mouthLine": 0.76, "hairline": 0.0,
    },
    "features": [
        {"id": "brow-left", "kind": "brow", "side": "left"},
        {"id": "brow-right", "kind": "brow", "side": "right"},
        {"id": "eye-left", "kind": "eye", "side": "left", "shape": "inverted-u-arch"},
        {"id": "eye-right", "kind": "eye", "side": "right", "shape": "inverted-u-arch"},
        {"id": "mouth-smile", "kind": "mouth", "side": "center", "shape": "concave-arc"},
    ],
    "confidence": 0.8,
    "note": (
        "Chibi mascot, ~2.6 head units. The 'head' is the bell including rim; the face "
        "panel is an inset appliance on the bell, not a skull, so eye/nose placement is "
        "read off the panel rather than from human facial canon. No nose exists by design. "
        "Proportions are measured from the artwork's own coordinates."
    ),
}

path.write_text(json.dumps(data, indent=2), encoding="utf-8")
print(f"filled preSpecAssessment -> {path}")
print(f"  primaryDomain   : {psa['objectClass']['primaryDomain']}")
print(f"  complexity tier : {psa['complexity']['tier']}")
print(f"  score total     : {sum(psa['complexity']['scores'].values())}/24")
print(f"  targetMinDetails: {psa['detailInventory']['targetMinDetails']} "
      f"({len(psa['detailInventory']['details'])} enumerated)")
print(f"  anatomy heads   : {psa['anatomy']['styleHeads']}")
