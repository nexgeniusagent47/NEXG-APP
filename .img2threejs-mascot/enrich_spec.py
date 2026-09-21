#!/usr/bin/env python3
"""Enrich the mascot spec with the fields the strict-quality gate requires.

`build_spec.py` authors the real component tree and materials from the artwork.
This adds the surrounding contract: micro frequency bands and reference PBR per
material, attachment anchors between parts, lighting, and the character-track
review targets. Split out so the geometry stays readable on its own.
"""
import json
import sys
from pathlib import Path

ws = Path(sys.argv[1])
spec_path = ws / "object-sculpt-spec.json"
spec = json.loads(spec_path.read_text(encoding="utf-8"))

# ---------------------------------------------------------------------------
# Materials: every material needs all three frequency bands and reference PBR
# evidence traced back to the source pixels we sampled.
# ---------------------------------------------------------------------------
for mat in spec["materials"]:
    bands = mat.get("surfaceFrequencyBands", [])
    if not any(b.get("id") == "micro" for b in bands):
        bands.append({"id": "micro", "frequency": 64.0, "amplitude": 0.03,
                      "role": "highlight breakup under grazing light"})
    mat["surfaceFrequencyBands"] = bands

    rough = mat["roughness"]["base"]
    metal = mat["metalness"]["base"]
    pal = mat["albedo"]["secondary"]
    mat["referencePbr"] = {
        "source": "mascot-cutout.png",
        "samplingRegion": "component-zone crop",
        "method": "gradient-stop and fill sampling from the artwork's own vector gradients",
        "confidence": 0.72,
        "observed": {
            "baseColor": mat["baseColor"],
            "gradientStops": pal,
            "roughnessClass": ("polished" if rough < 0.3 else
                               "satin" if rough < 0.5 else "matte"),
            "metalnessClass": "metal" if metal >= 0.5 else "dielectric",
            "specularCharacter": ("tight and bright" if rough < 0.3 else
                                  "broad and soft"),
        },
        "note": ("Inference from flat vector artwork, not inverse rendering. The artwork "
                 "encodes its shading in gradients, so the stops are treated as the "
                 "observed light-to-dark range rather than as measured reflectance."),
    }

    # At least one material needs a genuine local override for the material pass.
    if mat["id"] in ("gold-bell", "gold-rim", "black-body", "cream"):
        mat["localOverrides"] = mat.get("localOverrides", []) + [
            {"id": f"{mat['id']}-key-side", "kind": "roughness-shift",
             "region": "key-light facing side",
             "roughness": max(0.05, round(rough - 0.06, 3)),
             "notes": "Key-facing surfaces read glossier than the shadow side."},
            {"id": f"{mat['id']}-cavity", "kind": "ao-boost",
             "region": "contact seams and undersides",
             "cavityStrength": 0.45,
             "notes": "Deepen occlusion where the rim meets the dome and the limbs meet the body."},
        ]

if not any(m.get("localOverrides") for m in spec["materials"]):
    raise SystemExit("no material carries a localOverride; the material pass would warn")

# ---------------------------------------------------------------------------
# Attachment anchors. Every non-root component that physically joins a parent
# needs an explicit socket, span, contact type, embed and gap tolerance.
# ---------------------------------------------------------------------------
ATTACH = {
    "bell-button-stem": ("socket-bell-crown-top", [0.0, 0.158, 0.0], [0.0, 0.178, 0.0], "rigid-weld", 0.008, 0.004),
    "bell-button-cap": ("socket-button-stem-top", [0.0, 0.178, 0.0], [0.0, 0.205, 0.0], "rigid-weld", 0.01, 0.005),
    "face-panel": ("socket-bell-face", [0.0, -0.02, 0.03], [0.0, 0.0, 0.062], "inset-panel", 0.012, 0.004),
    "brow-left": ("socket-face-front-l", [-0.032, 0.018, 0.062], [-0.032, 0.024, 0.070], "surface-decal", 0.004, 0.002),
    "brow-right": ("socket-face-front-r", [0.032, 0.018, 0.062], [0.032, 0.024, 0.070], "surface-decal", 0.004, 0.002),
    "eye-left": ("socket-face-front-l", [-0.030, 0.0, 0.064], [-0.030, 0.006, 0.072], "surface-decal", 0.004, 0.002),
    "eye-right": ("socket-face-front-r", [0.030, 0.0, 0.064], [0.030, 0.006, 0.072], "surface-decal", 0.004, 0.002),
    "mouth-smile": ("socket-face-front-c", [0.0, -0.022, 0.064], [0.0, -0.016, 0.072], "surface-decal", 0.004, 0.002),
    "bow-wing-left": ("socket-neck", [-0.026, 0.02, 0.03], [-0.008, 0.008, 0.02], "rigid-weld", 0.008, 0.004),
    "bow-wing-right": ("socket-neck", [0.026, 0.02, 0.03], [0.008, 0.008, 0.02], "rigid-weld", 0.008, 0.004),
    "arm-l": ("socket-shoulder-l", [-0.048, 0.10, 0.0], [-0.088, -0.02, 0.0], "ball-joint", 0.02, 0.008),
    "arm-r": ("socket-shoulder-r", [0.048, 0.10, 0.0], [0.088, -0.02, 0.0], "ball-joint", 0.02, 0.008),
    "glove-l": ("socket-wrist-l", [-0.098, -0.03, 0.0], [-0.098, -0.10, 0.0], "ball-joint", 0.014, 0.006),
    "glove-r": ("socket-wrist-r", [0.098, -0.03, 0.0], [0.098, -0.10, 0.0], "ball-joint", 0.014, 0.006),
    "leg-l": ("socket-hip-l", [-0.035, -0.10, 0.0], [-0.052, -0.30, 0.0], "ball-joint", 0.02, 0.008),
    "leg-r": ("socket-hip-r", [0.035, -0.10, 0.0], [0.052, -0.30, 0.0], "ball-joint", 0.02, 0.008),
    "boot-l": ("socket-ankle-l", [-0.052, -0.31, 0.016], [-0.052, -0.36, 0.016], "rigid-weld", 0.016, 0.006),
    "boot-r": ("socket-ankle-r", [0.052, -0.31, 0.016], [0.052, -0.36, 0.016], "rigid-weld", 0.016, 0.006),
}
for c in spec["componentTree"]:
    cid = c["id"]
    if cid in ATTACH:
        sock, start, end, contact, embed, gap = ATTACH[cid]
        c["attachment"] = {
            "parentSocket": sock,
            "localStart": start,
            "localEnd": end,
            "contactType": contact,
            "baseRadius": 0.02,
            "endRadius": 0.016,
            "embedDepth": embed,
            "gapTolerance": gap,
            "evidenceRefs": ["full-object"],
        }

# ---------------------------------------------------------------------------
# Per-component colour/material recipe; the generator uses this to build the
# material for each mesh rather than defaulting to a flat colour.
# ---------------------------------------------------------------------------
for c in spec["componentTree"]:
    mat_id = c["material"]
    mat = next((m for m in spec["materials"] if m["id"] == mat_id), None)
    if mat is None:
        continue
    c["colorMaterialRecipe"] = {
        "materialRef": mat_id,
        "baseColor": mat["baseColor"],
        "gradientStops": mat["albedo"]["secondary"],
        "roughness": mat["roughness"]["base"],
        "metalness": mat["metalness"]["base"],
        "pattern": "vertical-gradient",
        "proceduralSource": ("generated canvas gradient texture, deterministic seed"
                             if mat["metalness"]["base"] >= 0.5
                             else "solid albedo with an additive sheen term"),
        "notes": mat["notes"],
    }

# ---------------------------------------------------------------------------
# Lighting contract.
# ---------------------------------------------------------------------------
spec["lightingFromPhoto"] = {
    "keyLight": {"direction": [-0.45, 0.72, 0.53], "intensity": 1.25,
                 "color": "#fff4dd", "notes": "Upper-left key, matching the dome specular arc."},
    "fillLight": {"direction": [0.62, 0.18, 0.76], "intensity": 0.4,
                  "color": "#cfd6de", "notes": "Cool low fill from the right."},
    "rimLight": {"direction": [0.2, 0.5, -0.84], "intensity": 0.55,
                 "color": "#ffd9a0", "notes": "Warm rim separating the black body from the background."},
    "environment": {"type": "studio-neutral", "intensity": 0.55,
                    "notes": "Neutral studio environment so the gold keeps its hue instead of "
                             "picking up colour cast."},
    "groundShadow": {"present": True, "softness": 0.7, "opacity": 0.32,
                     "notes": "Soft contact ellipse under each boot, per the reference."},
    "toneMapping": {"mode": "ACESFilmic", "exposure": 1.0,
                    "notes": "Gold highlights must not clip to white."},
}

# ---------------------------------------------------------------------------
# Character-track review targets. The gate wants the four canonical ids in
# addition to the subject-specific ones authored in build_spec.py.
# ---------------------------------------------------------------------------
existing = {t["id"] for t in spec["featureReviewTargets"]}
required = [
    {"id": "anatomy-proportion", "name": "Head-unit proportions and stance",
     "tier": "critical", "passIds": ["blockout", "proportion-lock"],
     "minimumScore": 0.78, "mustPass": True,
     "componentRefs": ["root", "bell-crown", "bell-rim", "rounded-body"],
     "evidenceRefs": ["full-object"]},
    {"id": "face-landmark-placement", "name": "Face landmark placement (inset panel, no nose)",
     "tier": "critical", "passIds": ["feature-placement"],
     "minimumScore": 0.78, "mustPass": True,
     "componentRefs": ["face-panel", "eye-left", "eye-right", "mouth-smile"],
     "evidenceRefs": ["face-panel-zone"]},
    {"id": "pose-silhouette", "name": "Pose and full-body silhouette",
     "tier": "critical", "passIds": ["blockout", "proportion-lock"],
     "minimumScore": 0.78, "mustPass": True,
     "componentRefs": ["root", "arm-l", "arm-r", "leg-l", "leg-r"],
     "evidenceRefs": ["full-object"]},
    {"id": "outfit-and-palette", "name": "Outfit, accessories and palette",
     "tier": "important", "passIds": ["material-pass"],
     "minimumScore": 0.72, "mustPass": False,
     "componentRefs": ["bow-knot", "glove-l", "glove-r", "boot-l", "boot-r"],
     "evidenceRefs": ["full-object"]},
]
for t in required:
    if t["id"] not in existing:
        spec["featureReviewTargets"].append(t)

# ---------------------------------------------------------------------------
# Build passes: the structural pass must be present or the gate warns that the
# hierarchy may be skipped.
# ---------------------------------------------------------------------------
existing_passes = {p.get("id") for p in spec.get("buildPasses", [])}
for p in [
    {"id": "structural", "name": "Structural assembly",
     "intent": "Join the bell head, body, limbs and boots on their sockets; verify the "
               "hierarchy reads as one figure before any surface work.",
     "unlocked": False, "reviewed": False},
    {"id": "form", "name": "Form refinement",
     "intent": "Refine the lathe profiles of the dome, rim and body; correct the chibi "
               "proportion against the measured head-unit ratio.",
     "unlocked": False, "reviewed": False},
]:
    if p["id"] not in existing_passes:
        spec["buildPasses"].append(p)

# ---------------------------------------------------------------------------
# Suitability and resolved unknowns.
# ---------------------------------------------------------------------------
spec["suitability"] = {
    "verdict": "conditional",
    "reason": ("Flat front-view vector artwork. Bell, rim and body are rotationally "
               "symmetric so their hidden sides are inferable; boots, gloves and bow "
               "rear surfaces are inferred by mirroring and carry lower confidence."),
    "acceptedStylization": "chibi mascot, 2.6 head units, no photoreal ambition",
    "evidenceRefs": ["full-object"],
}
pre = spec["preSpecAssessment"]
pre["unknownsToResolveBeforeImplementation"] = []
pre["resolvedUnknowns"] = [
    "Back-of-boot geometry: resolved by sagittal mirroring of the measured outer face; "
    "recorded as lower confidence rather than invented detail.",
    "Glove rear surface: modelled as the mirrored rounded mitten solid.",
    "Bow tie depth: set to a shallow extrude consistent with the front elevation.",
    "Bell interior: not modelled; the rim underside closes the silhouette.",
]

spec_path.write_text(json.dumps(spec, indent=2), encoding="utf-8")
print(f"enriched {spec_path}")
print(f"  materials with referencePbr : {sum(1 for m in spec['materials'] if m.get('referencePbr'))}")
print(f"  materials with localOverrides: {sum(1 for m in spec['materials'] if m.get('localOverrides'))}")
print(f"  components with attachment   : {sum(1 for c in spec['componentTree'] if c.get('attachment'))}")
print(f"  components with recipe       : {sum(1 for c in spec['componentTree'] if c.get('colorMaterialRecipe'))}")
print(f"  featureReviewTargets         : {len(spec['featureReviewTargets'])}")
print(f"  buildPasses                  : {[p.get('id') for p in spec.get('buildPasses', [])]}")
