"""What render.py fills in when a map leaves it out, so a map holds only its content.

UI holds every string the viewer's own interface shows (buttons, labels, panel headings, screen
reader text). A map overrides any of them in its `ui` section; the rest come from here.
Strings are plain text; {name} is filled in by the viewer.
"""

UI = {
    # Controls above the map
    'controlsLabel': 'Explore the map',
    'flowLabel': 'Watch a flow',
    'flowChoose': 'Choose a flow',
    'flowMenu': 'Available flows',
    'flowsSystem': 'System flows',
    'flowsFailure': 'Failure scenario',
    'flowPlay': 'Play flow',
    'buildControl': 'How to build it',
    'fullSystem': 'Full system',
    'buildStepAria': 'Step {step}',
    'tourNew': 'New here?',
    'tourEntry': 'Take the guided tour',
    'tourResume': 'Resume the tour · step {step}',
    'filesEntry': 'Project structure',
    'themeTitle': 'Switch theme',
    'themeToDark': 'Switch to dark theme',
    'themeToLight': 'Switch to light theme',
    # Help: the "?" card beside the theme switch and the controls' hover hints
    'helpTitle': 'How to read this map',
    'helpTourAsk': 'New here or short on time?',
    'helpTour': 'Take the guided tour: a few minutes, everything in order.',
    'helpOverviewAsk': 'What is it made of?',
    'helpOverview': 'The big picture.',
    'helpMapAsk': 'What does each part do?',
    'helpMap': 'The full map. Click a card for details.',
    'helpMapInside': 'Some open to show how they work inside.',
    'helpFlowAsk': 'How does it behave?',
    'helpFlow': 'Watch a flow: the main scenarios, step by step.',
    'helpFilesAsk': 'Where is it in the code?',
    'helpFiles': 'Project structure: the repository, tied to the map.',
    'helpBuildAsk': 'Want to go deeper?',
    'helpBuild': 'How to build it: the system from scratch, layer by layer.',
    # The bar over the map
    'bigPicture': 'The big picture',
    'fullMap': 'The full map',
    'backToBigPicture': 'Big picture',
    'clearStage': 'Clear {stage} stage filter',
    'showAllStages': 'Show all stages',
    'showPanel': 'Show panel',
    'closePanel': 'Close panel',
    'fullScreen': 'Full screen',
    'exitFullScreen': 'Exit full screen',
    'zoomGroup': 'Canvas zoom',
    'zoomOut': 'Zoom out',
    'zoomIn': 'Zoom in',
    'zoomFit': 'Fit',
    'zoomFitTitle': 'Fit whole map',
    'backToMap': 'Back to the map',
    'cardOpen': 'Open →',
    # Panels
    'stageEyebrow': 'Part',
    'stageMembers': 'Components in this part',
    'stageNote': 'Flows follow the connections between these components.',
    'nodeBuildStep': 'Build step {step} of {total}',
    'fileSuffix': ' · File',
    'what': 'What it does',
    'why': 'Why it matters',
    'decision': 'Why this choice',
    'tools': 'Technology',
    'repository': 'In the code',
    'showInFiles': 'Show {path} in the project files',
    'lookInside': 'Look inside',
    'buildStepTitle': 'How to build it · Step {step} of {total}',
    'newNodes': 'Components added',
    'runnable': 'Try it',
    'buildNote': "Each step adds what rests on the ones before. One sensible order, not the project's history.",
    # Flows
    'flowEyebrow': 'Flow',
    'failureFlowEyebrow': 'Failure flow',
    'flowComplete': 'Flow complete. Choose another flow or open a component.',
    # Guided tour
    'tourTitle': 'Guided tour',
    'tourChapters': 'Tour chapters',
    'tourExit': 'Exit tour',
    'tourExitShort': 'Exit',
    'tourStatus': 'Step {step} of {total} · {left}',
    'tourComplete': 'Complete',
    'tourCardCount': '{chapter} · {step} of {total}',
    'tourLessThanMinute': 'less than a minute left',
    'tourMinutesLeft': 'about {minutes} min left',
    'tourProgress': 'Progress in this step',
    'tourHint': 'Press Next to walk through each step.',
    'tourBack': 'Back',
    'tourNext': 'Next',
    'tourBegin': 'Begin',
    'tourFinish': 'Finish',
    'tourKeysMove': 'to go back or next',
    'tourKeysExit': 'to exit',
    'tourDone': "You've finished the tour",
    'completionCount': 'Tour complete · {steps} steps',
    # Project structure
    'filesAt': 'at',
    'filesEyebrow': 'Start here',
    'filesHeading': 'Where each part lives',
    'filesIntro': 'The paths of {repo} that matter for the map, {count} of them, each with a line on what it holds.',
    'filesHowTo': 'How to read it',
    'filesTagsTerm': 'Coloured tags',
    'filesTags': 'are components on the map; click one to jump there.',
    'filesFolderTerm': 'The folder colour',
    'filesFolder': 'follows the role of its component. Grey means plumbing (config, docs, tooling) or a mix of roles.',
    'filesClickRow': 'Click a row for why it exists.',
    'filesKeysWalk': 'walk the tree,',
    'filesKeysFold': 'fold it.',
    'filesWhat': 'What lives here',
    'filesWhy': 'Why it exists',
    'filesOnMap': 'On the map',
    'filesInside': 'Inside',
    'filesShowOnMap': 'Show {name} on the map',
}

# Seconds a tour step or a flow step stays before moving on when nothing else sets its pace.
BEAT_SECONDS = 15


def appearance_roles(d, used):
    """Which role colours the interface borrows: accent (links, the default flow colour), artifact
    (files and records in close-ups) and error (failure marks). Picked from the roles the map uses,
    preferring the library presets; the map's own settings.appearanceRoles entries win."""
    flows = [f.get('hue') for f in (d.get('flows') or {}).values() if isinstance(f, dict) and f.get('hue')]
    pick = lambda *keys: next((k for k in keys if k and k in used), None)
    accent = pick('component', *flows) or next(iter(sorted(used)), None)
    return {'accent': accent, 'artifact': pick('store') or accent, 'error': pick('alert', 'error', 'external') or accent}


def with_defaults(d):
    """The map with every service section filled in. Authored values always win. Returns a new dict."""
    if not isinstance(d, dict):
        return d
    d = dict(d)
    d['ui'] = {**UI, **(d.get('ui') if isinstance(d.get('ui'), dict) else {})}
    for key in ('panels', 'page', 'groups', 'flows', 'insides', 'icons', 'logos', 'roles'):
        d.setdefault(key, {})
    for key in ('zones', 'overviewEdges'):
        d.setdefault(key, [])
    d.setdefault('beatSeconds', BEAT_SECONDS)
    d.setdefault('flowBeatSeconds', d['beatSeconds'] if isinstance(d['beatSeconds'], (int, float)) else BEAT_SECONDS)
    settings = dict(d.get('settings') if isinstance(d.get('settings'), dict) else {})
    overview = [b.get('g') for b in d.get('overview', []) if isinstance(b, dict)]
    settings.setdefault('recapOrder', overview)
    d['settings'] = settings
    layout = d.get('layout')
    if isinstance(layout, dict):
        layout = dict(layout)
        layout.setdefault('annotations', [])
        layout.setdefault('insideMarkers', '')
        layout.setdefault('scale', {'x': 1, 'y': 1})
        d['layout'] = layout
    return d


def roles_used(d):
    """Role keys the map refers to: node categories, group, zone and flow hues, tour chapters."""
    items = lambda key: [x for x in (d.get(key) or []) if isinstance(x, dict)]
    values = lambda key: [x for x in (d.get(key) or {}).values() if isinstance(x, dict)]
    used = {n.get('cat') for n in items('nodes')} | {g.get('huekey') for g in values('groups')}
    used |= {z.get('hue') for z in items('zones')} | {f.get('hue') for f in values('flows')}
    return used - {None}


def with_appearance(d, roles):
    """settings.appearanceRoles and settings.buildRole, filled from the roles the page will have."""
    settings = dict(d['settings'])
    chosen = {**appearance_roles(d, set(roles)), **(settings.get('appearanceRoles') or {})}
    settings['appearanceRoles'] = chosen
    settings.setdefault('buildRole', chosen['accent'])
    return {**d, 'settings': settings}
