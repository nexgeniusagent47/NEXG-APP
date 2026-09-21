#!/usr/bin/env python3
"""Author the real ObjectSculptSpec component tree for the Gold Bell Mascot.

The character template scaffolds a generic humanoid: pelvis, abdomen, eye-cavity,
nose. This mascot has none of those -- its head is a call bell, its face is an inset
panel with no nose by design, and its torso is one sphere. So the scaffolded tree is
replaced wholesale with the parts the artwork actually names, and the proportions come
from `measurements.json` (alpha-channel occupancy) rather than a stock adult ratio.

Coordinates: the artwork viewBox is 709x1024, y down. Everything here is converted to
a unit figure: x centred on 0, y measured up from the feet, figure height = 1.0.
"""
import json
import sys
from pathlib import Path

ws = Path(sys.argv[1])
spec_path = ws / "object-sculpt-spec.json"
meas = json.loads((ws / "measurements.json").read_text(encoding="utf-8"))

spec = json.loads(spec_path.read_text(encoding="utf-8"))

# ---------------------------------------------------------------------------
# Unit conversion. Source coords are the SVG viewBox; content box is the alpha
# bounding box measured in the 2x raster (divide by 2 to get viewBox units).
# ---------------------------------------------------------------------------
H_FIG = 1843 / 2.0          # figure height in viewBox units
Y_FEET = (1843 + 2 * 0) / 2.0  # content bottom, viewBox units
X_CX = 709 / 2.0            # mirrored axis of the artwork


def ux(x):
    """viewBox x -> centred unit x."""
    return round((x - X_CX) / H_FIG, 4)


def uy(y):
    """viewBox y (down) -> unit height above feet (up)."""
    return round((Y_FEET - y) / H_FIG, 4)


def ul(v):
    """viewBox length -> unit length."""
    return round(v / H_FIG, 4)


# Key heights, read off the reference and the measurement bands.
Y_BELL_TOP = uy(28)
Y_RIM_BOT = uy(390)
Y_RIM_TOP = uy(337)
Y_BODY_TOP = uy(360)
Y_BODY_C = uy(468)
Y_BODY_BOT = uy(575)
Y_BOW = uy(444)
Y_LEG_TOP = uy(559)
Y_LEG_BOT = uy(817)
Y_BOOT_TOP = uy(790)
Y_FOOT = uy(Y_FEET)
Y_GLOVE = uy(610)

W_RIM = ul(986 / 2.0)
W_BODY = ul(960 / 2.0)


def comp(cid, name, level, role, primitive, topo, why, parent, **kw):
    """Build one component with the full shape the schema expects."""
    mat = kw.pop("material", "black-body")
    d = kw.pop("dims", (0.1, 0.1, 0.1))
    pos = kw.pop("pos", (0.0, 0.0, 0.0))
    c = {
        "id": cid,
        "name": name,
        "level": level,
        "role": role,
        "importance": kw.pop("importance", 0.8),
        "confidence": kw.pop("confidence", 0.85),
        "primitive": primitive,
        "topologyClass": topo,
        "topologyRationale": why,
        "geometryDescriptor": kw.pop("geom", {
            "topologyIntent": "stylized mascot part",
            "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1},
            "deformationStack": [],
            "uvStrategy": "generated procedural coordinates",
            "normalStrategy": "smooth vertex normals",
        }),
        "parent": parent,
        "attachment": kw.pop("attachment", None),
        "dimensions": {
            "width": d[0], "height": d[1], "depth": d[2],
            "units": "relative", "confidence": kw.pop("dimConfidence", 0.85),
        },
        "transform": {
            "position": list(pos),
            "rotation": kw.pop("rotation", [0, 0, 0]),
            "scale": list(d),
        },
        "actionProfile": {
            "animationRole": kw.pop("animRole", "static"),
            "pivot": {
                "mode": kw.pop("pivotMode", "center"),
                "localPosition": list(kw.pop("pivotPos", [0, 0, 0])),
                "axis": [0, 1, 0],
                "confidence": 0.8,
            },
            "transformChannels": {
                "translate": True, "rotate": True, "scale": True,
                "bend": False, "twist": False,
                "detach": kw.pop("detach", False), "visibility": True,
                "materialState": False,
            },
            "sockets": kw.pop("sockets", []),
            "collider": {
                "type": "box", "offset": [0, 0, 0], "scale": [1, 1, 1],
                "isTrigger": False, "notes": "box proxy",
            },
            "constraints": [],
            "destruction": {
                "breakable": False, "fractureGroup": cid,
                "seamRefs": [], "detachableFragments": [],
                "breakImpulse": 0.0, "debrisMaterial": mat,
            },
        },
        "material": mat,
        "materialLayers": kw.pop("materialLayers", [mat]),
        "deformations": [],
        "joints": kw.pop("joints", []),
        "seams": [],
        "localFeatures": kw.pop("localFeatures", []),
        "surfaceDetail": kw.pop("surfaceDetail", {
            "macroRoughness": 0.0, "microRoughness": 0.0, "bumpAmplitude": 0.0,
            "normalPattern": "", "displacementPattern": "",
            "occlusionPattern": "", "edgeWearPattern": "", "notes": "",
        }),
        "evidenceRefs": kw.pop("evidenceRefs", ["full-object"]),
        "details": kw.pop("details", []),
        "fidelityTier": kw.pop("fidelityTier", "blockout"),
    }
    assert not kw, f"unconsumed keys for {cid}: {list(kw)}"
    return c


comps = []

comps.append(comp(
    "root", "Gold Bell Mascot (root)", "macro", "body", "sphere", "assembled-solid",
    "Root container only; carries no geometry of its own.", None,
    material="gold-bell", dims=(0.001, 0.001, 0.001), pos=(0.0, 0.5, 0.0),
    animRole="root", importance=1.0,
    sockets=[
        {"id": "socket-neck", "localPosition": [0.0, uy(430), 0.0], "purpose": "bow/neck mount"},
        {"id": "socket-glow", "localPosition": [0.0, uy(150), 0.0], "purpose": "face emissive anchor"},
    ],
))

# --- BELL HEAD -------------------------------------------------------------
comps.append(comp(
    "bell-crown", "Bell crown dome", "macro", "shell", "lathe", "continuous-sculpt",
    "A single smoothly-varying dome of revolution -- a bell's crown. Rotationally "
    "symmetric, so a lathe profile is structurally correct; a box or cylinder would "
    "misrepresent the silhouette.",
    "root",
    material="gold-bell", dims=(ul(830), ul(320), ul(830)),
    pos=(0.0, (Y_BELL_TOP + Y_RIM_TOP) / 2.0, 0.0), importance=1.0,
    animRole="head",
    geom={
        "topologyIntent": "dome of revolution, hemispherical with slight superellipse flattening",
        "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1},
        "deformationStack": [],
        "uvStrategy": "generated procedural coordinates",
        "normalStrategy": "smooth vertex normals",
        "latheProfile": {
            "samples": 32,
            "note": "radius rises from 0.02 at the crown to full width at the rim seat",
        },
    },
    localFeatures=[
        {"id": "dome-specular-arc", "kind": "highlight",
         "description": "Vertical specular arc up the left of the dome, brightest at ~14% height.",
         "materialOverride": "gold-bell-specular"},
    ],
    surfaceDetail={
        "macroRoughness": 0.22, "microRoughness": 0.06, "bumpAmplitude": 0.0,
        "normalPattern": "", "displacementPattern": "", "occlusionPattern": "",
        "edgeWearPattern": "",
        "notes": "Polished gold; micro-scatter only, no relief.",
    },
))

comps.append(comp(
    "bell-button-stem", "Bell top button stem", "meso", "body", "cylinder",
    "assembled-solid", "A short rigid cylindrical post with flat machined faces.",
    "bell-crown",
    material="gold-bell", dims=(ul(42), ul(34), ul(42)),
    pos=(0.0, uy(91), 0.0), detach=True, importance=0.7,
    geom={
        "topologyIntent": "straight turned post", "edgeTreatment": {"type": "chamfer", "bevelRadius": 0.002, "segments": 2},
        "deformationStack": [], "uvStrategy": "generated procedural coordinates",
        "normalStrategy": "smooth vertex normals",
    },
))

comps.append(comp(
    "bell-button-cap", "Bell top button cap", "meso", "body", "lathe", "continuous-sculpt",
    "Round cap with a smooth domed top and flared base -- one continuous revolved mass.",
    "bell-button-stem",
    material="gold-bell-button", dims=(ul(120), ul(100), ul(120)),
    pos=(0.0, uy(50), 0.0), detach=True, importance=0.75,
    geom={
        "topologyIntent": "revolved button cap with base flare",
        "edgeTreatment": {"type": "round", "bevelRadius": 0.006, "segments": 3},
        "deformationStack": [], "uvStrategy": "generated procedural coordinates",
        "normalStrategy": "smooth vertex normals",
    },
    localFeatures=[
        {"id": "button-dome-specular", "kind": "highlight",
         "description": "Bright offset specular toward the upper left, matching the dome key light.",
         "materialOverride": "gold-bell-specular"},
    ],
))

comps.append(comp(
    "bell-rim", "Bell rim (flared double ring)", "macro", "shell", "lathe", "continuous-sculpt",
    "The rim is a revolved flared profile: it widens outward and downward through two "
    "steps. Modelling it as one lathe keeps the flare continuous; the two rings are a "
    "profile feature, not two separate objects.",
    "root",
    material="gold-rim", dims=(ul(986), ul(60), ul(986)),
    pos=(0.0, (Y_RIM_TOP + Y_RIM_BOT) / 2.0, 0.0), importance=1.0,
    geom={
        "topologyIntent": "flared bell rim, two-step profile, wider at the bottom edge",
        "edgeTreatment": {"type": "round", "bevelRadius": 0.004, "segments": 3},
        "deformationStack": [], "uvStrategy": "generated procedural coordinates",
        "normalStrategy": "smooth vertex normals",
        "latheProfile": {
            "samples": 26,
            "note": "outer radius steps out at the upper ring then again at the lower ring",
        },
    },
    localFeatures=[
        {"id": "rim-double-ring", "kind": "profile-step",
         "description": "Two stacked flared rings; the lower ring is wider and carries a bright top edge.",
         "locations": ["upper-ring", "lower-ring"]},
        {"id": "rim-highlight-lines", "kind": "highlight",
         "description": "Bright near-horizontal lines across each ring at ~8% and ~62% of ring height.",
         "materialOverride": "gold-rim-highlight", "count": 4},
    ],
    surfaceDetail={
        "macroRoughness": 0.26, "microRoughness": 0.07, "bumpAmplitude": 0.0,
        "normalPattern": "", "displacementPattern": "", "occlusionPattern": "",
        "edgeWearPattern": "slight brightening along the lower outer edge",
        "notes": "Gold rim; the highlight lines are material, not geometry.",
    },
))

# --- FACE ------------------------------------------------------------------
comps.append(comp(
    "face-panel", "Face panel (inset black)", "macro", "shell", "ellipsoid",
    "continuous-sculpt",
    "A smooth rounded black panel. It reads as a shallow continuous bulge seated in "
    "the dome, so an ellipsoid slice is closer than a flat plate.",
    "bell-crown",
    material="face-black", dims=(ul(510), ul(210), ul(150)),
    pos=(0.0, uy(280), ul(120)), importance=1.0,
    animRole="head",
    geom={
        "topologyIntent": "shallow domed panel inset into the bell face",
        "edgeTreatment": {"type": "round", "bevelRadius": 0.008, "segments": 3},
        "deformationStack": [], "uvStrategy": "generated procedural coordinates",
        "normalStrategy": "smooth vertex normals",
    },
    localFeatures=[
        {"id": "face-panel-inset", "kind": "inset",
         "description": "Black rounded panel inset into the dome with a thick gold bezel border.",
         "materialOverride": "gold-bezel"},
    ],
))

comps.append(comp(
    "brow-left", "Left brow", "meso", "body", "tube", "fiber-strand",
    "A thin curved stroke following a 2D path -- a swept tube, never a box.",
    "face-panel",
    material="expression-gold", dims=(ul(46), ul(25), ul(14)),
    pos=(ux(291), uy(214), ul(150)), importance=0.9,
    geom={"topologyIntent": "short upward-curving stroke",
          "edgeTreatment": {"type": "round", "bevelRadius": 0.003, "segments": 2},
          "deformationStack": [], "uvStrategy": "generated procedural coordinates",
          "normalStrategy": "smooth vertex normals"},
    localFeatures=[{"id": "brow-triple-stroke-l", "kind": "layered-stroke",
                    "description": "Black outline, amber mid, gold core, stacked by decreasing radius.",
                    "layerMaterials": ["ink-black", "expression-amber", "expression-gold"]}],
))

comps.append(comp(
    "brow-right", "Right brow", "meso", "body", "tube", "fiber-strand",
    "Mirror of the left brow: lateral axis negated, never a rotation.",
    "face-panel",
    material="expression-gold", dims=(ul(46), ul(25), ul(14)),
    pos=(ux(418), uy(214), ul(150)), importance=0.9,
    localFeatures=[{"id": "brow-triple-stroke-r", "kind": "layered-stroke",
                    "description": "Black outline, amber mid, gold core, stacked by decreasing radius.",
                    "layerMaterials": ["ink-black", "expression-amber", "expression-gold"]}],
))

comps.append(comp(
    "eye-left", "Left eye (inverted U arch)", "meso", "body", "tube", "fiber-strand",
    "The eye is an arch stroke of near-constant width following a path, not a filled "
    "socket. A tube along the arch path is the correct topology.",
    "face-panel",
    material="expression-gold", dims=(ul(60), ul(50), ul(26)),
    pos=(ux(294), uy(272), ul(150)), importance=1.0,
    localFeatures=[{"id": "eye-triple-stroke-l", "kind": "layered-stroke",
                    "description": "Black outline, amber mid, gold core.",
                    "layerMaterials": ["ink-black", "expression-amber", "expression-gold"]}],
))

comps.append(comp(
    "eye-right", "Right eye (inverted U arch)", "meso", "body", "tube", "fiber-strand",
    "Mirror of the left eye: lateral axis negated only.",
    "face-panel",
    material="expression-gold", dims=(ul(60), ul(50), ul(26)),
    pos=(ux(415), uy(272), ul(150)), importance=1.0,
    localFeatures=[{"id": "eye-triple-stroke-r", "kind": "layered-stroke",
                    "description": "Black outline, amber mid, gold core.",
                    "layerMaterials": ["ink-black", "expression-amber", "expression-gold"]}],
))

comps.append(comp(
    "mouth-smile", "Smile", "meso", "body", "tube", "fiber-strand",
    "A single concave arc stroke.",
    "face-panel",
    material="expression-gold", dims=(ul(72), ul(26), ul(26)),
    pos=(ux(355), uy(318), ul(150)), importance=1.0,
    localFeatures=[{"id": "smile-triple-stroke", "kind": "layered-stroke",
                    "description": "Black outline, amber mid, gold core.",
                    "layerMaterials": ["ink-black", "expression-amber", "expression-gold"]}],
))

# --- TORSO -----------------------------------------------------------------
comps.append(comp(
    "rounded-body", "Rounded body", "macro", "body", "lathe", "continuous-sculpt",
    "One smooth near-spherical mass with no seams. Revolved profile is correct; "
    "the artwork draws it as a single continuous silhouette.",
    "root",
    material="black-body", dims=(W_BODY * 2, ul(215), W_BODY * 2 * 0.94),
    pos=(0.0, Y_BODY_C, 0.0), importance=1.0, animRole="torso",
    geom={
        "topologyIntent": "slightly flattened sphere, wider than tall",
        "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1},
        "deformationStack": [], "uvStrategy": "generated procedural coordinates",
        "normalStrategy": "smooth vertex normals",
    },
    localFeatures=[
        {"id": "body-sheen", "kind": "highlight",
         "description": "Soft vertical sheen down the left of the sphere, fading by mid-body.",
         "materialOverride": "black-body-sheen"},
        {"id": "torso-fold", "kind": "crease",
         "description": "Two shallow chevron folds where the body meets the bow tie.",
         "count": 2, "location": "upper-front"},
    ],
))

comps.append(comp(
    "bow-wing-left", "Bow tie left wing", "meso", "shell", "extrude", "assembled-solid",
    "A flat folded panel with a distinct layered fold structure and hard edges.",
    "rounded-body",
    material="bow-black", dims=(ul(60), ul(46), ul(26)),
    pos=(ux(301), uy(452), ul(190)), importance=0.9, detach=True,
    geom={"topologyIntent": "folded bow wing, front face wider than the back",
          "edgeTreatment": {"type": "round", "bevelRadius": 0.004, "segments": 2},
          "deformationStack": [], "uvStrategy": "generated procedural coordinates",
          "normalStrategy": "smooth vertex normals"},
))

comps.append(comp(
    "bow-wing-right", "Bow tie right wing", "meso", "shell", "extrude", "assembled-solid",
    "Mirror of the left wing across the lateral axis.",
    "rounded-body",
    material="bow-black", dims=(ul(62), ul(48), ul(26)),
    pos=(ux(411), uy(452), ul(190)), importance=0.9, detach=True,
))

comps.append(comp(
    "bow-knot", "Bow tie center knot", "meso", "body", "ellipsoid", "assembled-solid",
    "A small discrete rounded block with its own volume, sitting proud of the wings.",
    "rounded-body",
    material="bow-knot", dims=(ul(44), ul(50), ul(30)),
    pos=(ux(356), uy(450), ul(196)), importance=0.85, detach=True,
))

# --- LIMBS -----------------------------------------------------------------
for side, sgn, x_arm, x_hand in (("l", -1, 214, 140), ("r", 1, 489, 570)):
    comps.append(comp(
        f"arm-{side}", f"{'Left' if sgn < 0 else 'Right'} arm", "macro", "limb",
        "curve-sweep", "continuous-sculpt",
        "A smooth tapered limb following a curved path away from the shoulder. A box "
        "stack would break the continuous taper.",
        "rounded-body",
        material="black-limb", dims=(ul(70), ul(200), ul(70)),
        pos=(ux(x_arm), uy(500), 0.0), importance=0.95,
        animRole="limb", detach=True,
        geom={
            "topologyIntent": "tapered swept limb, shoulder wider than wrist",
            "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1},
            "deformationStack": [], "uvStrategy": "generated procedural coordinates",
            "normalStrategy": "smooth vertex normals",
            "sweepPath": {"from": [ux(x_arm), uy(420)], "to": [ux(x_hand + 18 * -sgn), uy(560)]},
        },
        joints=[{"id": f"shoulder-{side}", "type": "ball",
                 "localPosition": [ux(x_arm), uy(415), 0.0]},
                {"id": f"elbow-{side}", "type": "hinge",
                 "localPosition": [ux(x_arm + 22 * -sgn), uy(490), 0.0]}],
        sockets=[{"id": f"socket-wrist-{side}",
                  "localPosition": [ux(x_hand + 18 * -sgn), uy(560), 0.0],
                  "purpose": "glove mount"}],
    ))
    for i, (w, y) in enumerate(((26, 562), (30, 578), (32, 592))):
        comps.append(comp(
            f"cuff-{side}-{i + 1}", f"{'Left' if sgn < 0 else 'Right'} cuff ring {i + 1}",
            "micro", "trim", "torus", "assembled-solid",
            "A distinct piped ring with its own volume, stacked over its neighbours.",
            f"glove-{side}",
            material="cream", dims=(ul(w * 2), ul(16), ul(w * 2)),
            pos=(ux(x_hand), uy(y), 0.0), importance=0.6, detach=True,
        ))
    comps.append(comp(
        f"glove-{side}", f"{'Left' if sgn < 0 else 'Right'} glove (mitten)",
        "macro", "limb", "ellipsoid", "continuous-sculpt",
        "One smooth rounded mitten mass with a separate thumb lobe -- continuous, not faceted.",
        f"arm-{side}",
        material="cream", dims=(ul(150), ul(170), ul(120)),
        pos=(ux(x_hand), uy(640), 0.0), importance=0.95,
        animRole="limb", detach=True,
        geom={
            "topologyIntent": "rounded mitten with a distinct thumb lobe",
            "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1},
            "deformationStack": [], "uvStrategy": "generated procedural coordinates",
            "normalStrategy": "smooth vertex normals",
        },
        joints=[{"id": f"wrist-{side}", "type": "ball",
                 "localPosition": [ux(x_hand), uy(565), 0.0]}],
        localFeatures=[{"id": f"glove-finger-seams-{side}", "kind": "seam",
                        "description": "Three short parallel seams across the back of each mitten.",
                        "count": 3, "location": "back"}],
    ))
    comps.append(comp(
        f"leg-{side}", f"{'Left' if sgn < 0 else 'Right'} leg", "macro", "limb",
        "curve-sweep", "continuous-sculpt",
        "A smooth tapered limb; the artwork shows no joint or seam along it.",
        "rounded-body",
        material="black-limb", dims=(ul(60), ul(260), ul(60)),
        pos=(ux(291 if sgn < 0 else 417), uy(690), 0.0), importance=0.95,
        animRole="limb", detach=True,
        geom={
            "topologyIntent": "tapered leg, hip wider than ankle",
            "edgeTreatment": {"type": "none", "bevelRadius": 0.0, "segments": 1},
            "deformationStack": [], "uvStrategy": "generated procedural coordinates",
            "normalStrategy": "smooth vertex normals",
            "sweepPath": {"from": [ux(291 if sgn < 0 else 417), uy(Y_LEG_TOP * H_FIG + 0)],
                          "to": [ux(272 if sgn < 0 else 440), uy(Y_LEG_BOT * H_FIG)]},
        },
        joints=[{"id": f"hip-{side}", "type": "ball",
                 "localPosition": [ux(291 if sgn < 0 else 417), uy(559), 0.0]},
                {"id": f"knee-{side}", "type": "hinge",
                 "localPosition": [ux(280 if sgn < 0 else 428), uy(690), 0.0]},
                {"id": f"ankle-{side}", "type": "ball",
                 "localPosition": [ux(272 if sgn < 0 else 440), uy(817), 0.0]}],
    ))
    bx = 251 if sgn < 0 else 461
    # Mirror exactly: the validator rejects a pair that is not a true sagittal
    # reflection, and an unpinned offset would drift the two sides apart.
    sole_dx, sole_dz = -4 * sgn, 4 * sgn
    lace_dx, lace_dz = 10 * sgn, 20 * sgn
    comps.append(comp(
        f"boot-{side}", f"{'Left' if sgn < 0 else 'Right'} boot upper", "macro", "shell",
        "extrude", "assembled-solid",
        "A sneaker upper with distinct panels -- an anisotropic solid with hard panel "
        "boundaries, not one smooth mass.",
        f"leg-{side}",
        material="cream", dims=(ul(180), ul(120), ul(280)),
        pos=(ux(bx), uy(870), ul(30)), importance=0.95,
        animRole="limb", detach=True,
        geom={"topologyIntent": "chunky sneaker upper, toe cap over gold mid panel",
              "edgeTreatment": {"type": "round", "bevelRadius": 0.006, "segments": 3},
              "deformationStack": [], "uvStrategy": "generated procedural coordinates",
              "normalStrategy": "smooth vertex normals"},
        joints=[{"id": f"foot-{side}", "type": "ball",
                 "localPosition": [ux(bx), uy(817), ul(30)]}],
        localFeatures=[
            {"id": f"boot-gold-panel-{side}", "kind": "panel",
             "description": "Gold side panel between the cream toe cap and the cream ankle cuff.",
             "materialOverride": "gold-boot-panel"},
            {"id": f"boot-swoosh-{side}", "kind": "decal",
             "description": "Small cream J-shaped curl mark on the gold panel.",
             "materialOverride": "cream"},
            {"id": f"boot-spark-{side}", "kind": "crease",
             "description": "Short bright vertical crease spark on the gold panel."},
        ],
    ))
    comps.append(comp(
        f"sole-{side}", f"{'Left' if sgn < 0 else 'Right'} boot sole", "meso", "shell",
        "extrude", "assembled-solid",
        "A thick cream sole slab that wraps up and around the toe as its own solid.",
        f"boot-{side}",
        material="cream", dims=(ul(200), ul(46), ul(300)),
        pos=(ux(bx + sole_dx), uy(910), ul(34 + sole_dz)), importance=0.85, detach=True,
    ))
    comps.append(comp(
        f"boot-decoration-{side}", f"{'Left' if sgn < 0 else 'Right'} boot lace detail",
        "micro", "trim", "torus", "assembled-solid",
        "Small cream piped lace bars seated on the instep.",
        f"boot-{side}",
        material="cream", dims=(ul(90), ul(20), ul(60)),
        pos=(ux(bx + lace_dx), uy(838), ul(100 + lace_dz)), importance=0.5,
        localFeatures=[{"id": f"boot-lace-bars-{side}", "kind": "seam",
                        "description": "Three short cream bars across the instep.",
                        "count": 3}],
    ))

# --- GROUND ----------------------------------------------------------------
comps.append(comp(
    "ground-shadow", "Ground contact shadow", "meso", "detail", "plane-card",
    "material-only",
    "No independent volume -- a soft translucent decal on the ground plane.",
    "root",
    material="shadow", dims=(ul(564), ul(72), ul(564)),
    pos=(0.0, uy(927), 0.0), importance=0.4, animRole="static",
    geom={"topologyIntent": "soft radial contact shadow", "edgeTreatment":
          {"type": "none", "bevelRadius": 0.0, "segments": 1},
          "deformationStack": [], "uvStrategy": "generated procedural coordinates",
          "normalStrategy": "flat normals"},
))

spec["componentTree"] = comps
print(f"authored {len(comps)} components")
print(f"  macro : {sum(1 for c in comps if c['level'] == 'macro')}")
print(f"  meso  : {sum(1 for c in comps if c['level'] == 'meso')}")
print(f"  micro : {sum(1 for c in comps if c['level'] == 'micro')}")
print(f"  localFeatures: {sum(len(c['localFeatures']) for c in comps)}")

# ---------------------------------------------------------------------------
# Materials, sampled from the artwork's own gradient stops.
# ---------------------------------------------------------------------------
GOLD = "#e0a637"
MATS = {
    "gold-bell": ("Bell crown gold", GOLD, 0.22, 1.0,
                  ["#a9660c", "#ffd277", "#e9ab40", "#c68321"],
                  "Polished gold with a strong vertical gradient; brightest band upper-third."),
    "gold-bell-button": ("Bell button gold", "#e2a63c", 0.2, 1.0,
                         ["#fff7ba", "#edaf42", "#bc7614"],
                         "Same gold family, slightly lighter; small part under strong key."),
    "gold-rim": ("Bell rim gold", "#dda23a", 0.26, 1.0,
                 ["#ffe198", "#f7c367", "#d99831", "#bd791b"],
                 "Gold rim, less glossy than the dome; bright top edge on each ring."),
    "gold-rim-highlight": ("Rim highlight", "#ffdc8a", 0.18, 1.0,
                           ["#ffe09a", "#ffcf6a"],
                           "Emissive-leaning highlight lines on the rim edges."),
    "gold-bell-specular": ("Gold specular arc", "#ffe6a0", 0.12, 1.0,
                           ["#ffe6a0", "#ffd064"],
                           "Specular arc overlay; low roughness, high intensity."),
    "gold-bezel": ("Face bezel gold", "#b4802c", 0.3, 1.0,
                   ["#ffdf83", "#f6c265", "#a36916"],
                   "Thick gold bezel around the face panel."),
    "gold-boot-panel": ("Boot gold panel", "#e8a733", 0.34, 1.0,
                        ["#c17e23", "#f5b746", "#e5a130", "#c38625"],
                        "Gold sneaker side panel; slightly rougher than the bell."),
    "black-body": ("Body matte black", "#0d0e0c", 0.48, 0.0,
                   ["#252624", "#191a18", "#0b0c0a", "#050604"],
                   "Near-black with a soft off-centre radial sheen; matte, non-metallic."),
    "black-body-sheen": ("Body sheen", "#393a33", 0.36, 0.0,
                         ["#44453f", "#2a2b26"],
                         "Broad soft sheen down the left of the body."),
    "black-limb": ("Limb black", "#0a0b09", 0.5, 0.0,
                   ["#090a09", "#252624", "#141513", "#050605"],
                   "Glossy black tube limbs with a narrow highlight band."),
    "face-black": ("Face panel black", "#101210", 0.42, 0.0,
                   ["#25241f", "#161714", "#070907"],
                   "Slightly warmer black than the body; reads as an inset panel."),
    "bow-black": ("Bow tie black", "#232420", 0.62, 0.0,
                  ["#414039", "#302f29", "#1a1b17"],
                  "Soft matte black with visible fold shading."),
    "bow-knot": ("Bow knot", "#2c2d27", 0.58, 0.0,
                 ["#3b3b33", "#2c2d27", "#191a16"],
                 "Marginally lighter than the wings so the knot reads forward."),
    "cream": ("Cream glove/boot", "#f2e3ca", 0.55, 0.0,
              ["#fff3df", "#f2e3ca", "#d8c5a8"],
              "Warm off-white with a soft top-left falloff."),
    "expression-gold": ("Expression gold", "#ffc855", 0.3, 0.0,
                        ["#ffdb7e", "#ffc855", "#efab38"],
                        "Face linework gold; slight emissive lift to read on black."),
    "expression-amber": ("Expression amber mid", "#bc862d", 0.35, 0.0,
                         ["#bc862d", "#ac7626"],
                         "Mid stroke layer between the ink outline and the gold core."),
    "ink-black": ("Expression ink outline", "#080905", 0.5, 0.0,
                  ["#080905", "#050805"],
                  "Darkest outline stroke behind each facial line."),
    "shadow": ("Ground shadow", "#636968", 1.0, 0.0,
               ["#636968", "#686d69"],
               "Soft translucent contact shadow at 32% opacity."),
}

mats = []
for mid, (name, base, rough, metal, palette, note) in MATS.items():
    m = {
        "id": mid, "name": name, "type": "standard",
        "shaderModel": "MeshStandardMaterial / PBR approximation",
        "baseColor": base, "color": base,
        "albedo": {"dominant": base, "secondary": palette, "samplingNotes": note},
        "colorVariation": {"palette": palette, "pattern": "gradient",
                           "amplitude": 0.12 if metal < 0.5 else 0.2,
                           "heightCorrelation": 0.2},
        "textureResolution": 1024,
        "textureProjection": {"mode": "uv", "repeat": [1.0, 1.0], "anisotropy": 8,
                              "texelDensityIntent": "object-scale, no stretch"},
        "surfaceFrequencyBands": [
            {"id": "macro", "frequency": 2.0, "amplitude": 0.3,
             "role": "broad colour breakup"},
            {"id": "meso", "frequency": 14.0, "amplitude": 0.1,
             "role": "subtle micro-scatter"},
        ],
        "roughness": {"base": rough, "variation": 0.06,
                      "map": "independent-procedural-field",
                      "localResponse": "lower roughness on the key-facing side"},
        "metalness": {"base": metal, "variation": 0.0},
        "normal": {"pattern": "none", "strength": 0.0, "scale": 1.0, "space": "tangent"},
        "bump": {"pattern": "none", "amplitude": 0.0, "scale": 1.0},
        "displacement": {"pattern": "none", "amplitude": 0.0, "scale": 1.0,
                         "silhouetteAffects": False},
        "ambientOcclusion": {"cavityStrength": 0.3, "contactShadowBias": 0.35,
                             "notes": "Darken the rim underside and the body/bow junction."},
        "wear": {"edgeWear": 0.0, "scratches": [], "chips": []},
        "dirt": {"amount": 0.0, "cavityBias": 0.0, "color": "#2F2A22"},
        "localOverrides": [],
        "shaderNotes": [
            "Gold uses metalness 1.0 with a strong vertical gradient; do not let the "
            "environment wash the hue out.",
            "Blacks are matte (metalness 0.0) and must not read as grey plastic.",
        ],
        "notes": note,
    }
    if mid == "shadow":
        m["opacity"] = {"base": 0.32}
        m["transparent"] = True
    mats.append(m)

spec["materials"] = mats
print(f"authored {len(mats)} materials")

# ---------------------------------------------------------------------------
# Repetition systems -- the strict gate wants at least one.
# ---------------------------------------------------------------------------
spec["repetitionSystems"] = [
    {
        "id": "cuff-piped-rings",
        "name": "Piped cuff rings",
        "description": "Three overlapping piped rings at each wrist, each with its own bright top edge.",
        "primitive": "torus",
        "count": 6,
        "distribution": "3 per wrist, stacked vertically with 0.008 unit spacing",
        "componentRefs": [f"cuff-{s}-{i}" for s in ("l", "r") for i in (1, 2, 3)],
        "materialRef": "cream",
        "variationRule": "outer radius grows 0.002 per ring downward",
        "evidenceRefs": ["glove-cuff-zone"],
    },
    {
        "id": "rim-highlight-lines",
        "name": "Rim highlight lines",
        "description": "Paired bright lines across each of the two flared rim rings.",
        "primitive": "material-stripe",
        "count": 4,
        "distribution": "2 per ring at ~8% and ~62% of ring height",
        "componentRefs": ["bell-rim"],
        "materialRef": "gold-rim-highlight",
        "variationRule": "upper line slightly brighter than lower",
        "evidenceRefs": ["bell-rim-zone"],
    },
    {
        "id": "expression-triple-strokes",
        "name": "Triple-stroke facial linework",
        "description": "Every facial line is drawn three times at decreasing radius to build an outline.",
        "primitive": "layered-tube",
        "count": 15,
        "distribution": "3 layers x 5 strokes (2 brows, 2 eyes, 1 mouth)",
        "componentRefs": ["brow-left", "brow-right", "eye-left", "eye-right", "mouth-smile"],
        "materialRef": "expression-gold",
        "variationRule": "radii 0.008 / 0.006 / 0.004 inward",
        "evidenceRefs": ["face-panel-zone"],
    },
]

# ---------------------------------------------------------------------------
# Feature review targets, rewritten for this subject.
# ---------------------------------------------------------------------------
spec["featureReviewTargets"] = [
    {"id": "bell-silhouette", "name": "Bell dome and flared rim silhouette",
     "tier": "critical", "passIds": ["blockout", "proportion-lock"],
     "minimumScore": 0.8, "mustPass": True,
     "componentRefs": ["bell-crown", "bell-rim", "bell-button-cap"],
     "evidenceRefs": ["full-object"]},
    {"id": "face-expression-placement", "name": "Face panel and expression placement",
     "tier": "critical", "passIds": ["feature-placement"],
     "minimumScore": 0.78, "mustPass": True,
     "componentRefs": ["face-panel", "eye-left", "eye-right", "mouth-smile",
                       "brow-left", "brow-right"],
     "evidenceRefs": ["face-panel-zone"]},
    {"id": "chibi-proportion", "name": "Chibi proportion and stance",
     "tier": "critical", "passIds": ["blockout", "proportion-lock"],
     "minimumScore": 0.78, "mustPass": True,
     "componentRefs": ["root", "bell-crown", "rounded-body", "leg-l", "leg-r"],
     "evidenceRefs": ["full-object"]},
    {"id": "bow-and-limbs", "name": "Bow tie, gloves and limbs",
     "tier": "important", "passIds": ["material-pass"],
     "minimumScore": 0.72, "mustPass": False,
     "componentRefs": ["bow-knot", "glove-l", "glove-r", "arm-l", "arm-r"],
     "evidenceRefs": ["full-object"]},
    {"id": "boots-and-palette", "name": "Boots and material palette",
     "tier": "important", "passIds": ["material-pass"],
     "minimumScore": 0.72, "mustPass": False,
     "componentRefs": ["boot-l", "boot-r", "sole-l", "sole-r"],
     "evidenceRefs": ["full-object"]},
]

spec["preSpecAssessment"] = json.loads(
    (ws / "assessment.json").read_text(encoding="utf-8"))["preSpecAssessment"]
spec["qualityContract"] = json.loads(
    (ws / "assessment.json").read_text(encoding="utf-8"))["qualityContract"]

spec_path.write_text(json.dumps(spec, indent=2), encoding="utf-8")
print(f"wrote {spec_path}")
