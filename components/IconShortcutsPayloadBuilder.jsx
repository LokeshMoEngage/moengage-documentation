import React, { useState, useEffect } from 'react';

const IconShortcutsPayloadBuilder = () => {
  const SHELL = { fontFamily: 'Inter, sans-serif', border: '1px solid #e1e8ed', borderRadius: '12px', background: '#fff', maxWidth: '950px', margin: '20px auto', overflow: 'hidden' };
  const BAR = { background: '#023047', color: 'white', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
  const BTN = { background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', fontSize: '10px', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' };
  const LABEL = { display: 'block', fontSize: '11px', fontWeight: '800', color: '#6a7c92', textTransform: 'uppercase', marginBottom: '6px' };
  const FIELD = { width: '100%', padding: '8px', border: '1px solid #e1e8ed', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' };
  const MONO = { ...FIELD, fontFamily: 'monospace' };

  const ACTIONS = [
    { name: 'navigate', label: 'Open a destination' },
    { name: 'share', label: 'Share text' },
    { name: 'call', label: 'Start a call' },
    { name: 'copy', label: 'Copy a code' },
    { name: 'track', label: 'Record behavior' },
    { name: 'custom', label: 'App-defined action' }
  ];

  const VALUE_HINT = {
    deepLink: 'myapp://category/headphones',
    screenName: 'com.yourcompany.store.ProductActivity',
    richLanding: 'https://example.com/autumn-sale',
    share: 'Explore the current offers',
    call: '+14155550123',
    copy: 'PROMO2026',
    event: 'icon_shortcut_clicked',
    userAttribute: 'last_shortcut_tapped',
    custom: '{"screen":"wallet"}'
  };

  const blankIcon = () => ({
    content: '',
    iat: '',
    action: 'navigate',
    navType: 'deepLink',
    trackType: 'event',
    valueOf: '',
    value: ''
  });

  const DEFAULT_STYLE = {
    shape: 'sq',
    corner: 16,
    useBg: true,
    bgColor: '#FFF3E0',
    showLargeIcon: false
  };

  const byteLength = (s) =>
    typeof TextEncoder !== 'undefined' ? new TextEncoder().encode(s).length : s.length;

  const [style, setStyle] = useState(DEFAULT_STYLE);
  const [icons, setIcons] = useState([blankIcon(), blankIcon(), blankIcon()]);
  const [json, setJson] = useState('');
  const [issues, setIssues] = useState([]);
  const [copied, setCopied] = useState(false);

  const setIcon = (i, patch) =>
    setIcons((prev) => prev.map((ic, idx) => (idx === i ? { ...ic, ...patch } : ic)));

  const addIcon = () => setIcons((prev) => (prev.length < 6 ? [...prev, blankIcon()] : prev));
  const removeIcon = (i) => setIcons((prev) => (prev.length > 3 ? prev.filter((_, idx) => idx !== i) : prev));

  const reset = () => {
    setStyle(DEFAULT_STYLE);
    setIcons([blankIcon(), blankIcon(), blankIcon()]);
  };

  useEffect(() => {
    const found = [];

    const widgets = icons.map((ic, idx) => {
      const n = idx + 1;
      if (!ic.content.trim()) found.push(`Icon ${n} has no image URL.`);
      else if (!/^https:\/\//i.test(ic.content.trim())) found.push(`Icon ${n} image URL must start with https://.`);
      if (!ic.value.trim()) found.push(`Icon ${n} has no action value.`);
      if (ic.action === 'track' && !ic.valueOf.trim()) found.push(`Icon ${n} track action needs a recorded value.`);

      let action;
      if (ic.action === 'navigate') {
        action = { name: 'navigate', type: ic.navType, value: ic.value.trim() };
      } else if (ic.action === 'track') {
        action = { name: 'track', type: ic.trackType, value: ic.value.trim(), kvPairs: { valueOf: ic.valueOf.trim() } };
      } else {
        action = { name: ic.action, value: ic.value.trim() };
      }

      const widget = { id: n, type: 'image', content: ic.content.trim() };
      if (ic.iat.trim()) widget.iat = ic.iat.trim();
      widget.actions = [action];
      return widget;
    });

    const styleObj = { i_sh: style.shape };
    if (Number(style.corner) > 0) styleObj.co_r = Number(style.corner);
    if (style.useBg) styleObj.bgColor = style.bgColor;

    const payload = {
      richPush: {
        displayName: 'IconShortcuts',
        android: { showLargeIcon: style.showLargeIcon },
        expanded: {
          type: 'iconShortcuts',
          style: styleObj,
          cards: [{ id: 1, type: 'iconShortcuts', widgets }]
        }
      }
    };

    setJson(JSON.stringify(payload));
    setIssues(found);
  }, [icons, style]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      setCopied(false);
    }
  };

  const bytes = byteLength(json);
  const heavy = bytes > 3000;

  return (
    <div style={SHELL}>
      <div style={BAR}>
        <span style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>Icon Shortcuts Payload Builder</span>
        <button onClick={reset} style={BTN}>RESET</button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', background: '#e1e8ed', gap: '1px' }}>
        <div style={{ flex: '1.4', minWidth: '340px', background: '#fff', padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

          <div>
            <label style={LABEL}>Card and icon appearance</label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: '120px' }}>
                <div style={{ fontSize: '10px', color: '#6a7c92', marginBottom: '4px' }}>Icon shape</div>
                <select value={style.shape} onChange={(e) => setStyle((p) => ({ ...p, shape: e.target.value }))} style={FIELD}>
                  <option value="ci">Circle</option>
                  <option value="sq">Square</option>
                </select>
              </div>
              <div style={{ flex: '1', minWidth: '120px' }}>
                <div style={{ fontSize: '10px', color: '#6a7c92', marginBottom: '4px' }}>Corner rounding</div>
                <input type="number" min="0" value={style.corner} onChange={(e) => setStyle((p) => ({ ...p, corner: parseInt(e.target.value, 10) || 0 }))} style={MONO} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input type="checkbox" checked={style.useBg} onChange={(e) => setStyle((p) => ({ ...p, useBg: e.target.checked }))} />
              Background color
            </label>
            {style.useBg && (
              <>
                <input type="color" value={style.bgColor} onChange={(e) => setStyle((p) => ({ ...p, bgColor: e.target.value.toUpperCase() }))} style={{ width: '38px', height: '30px', border: '1px solid #e1e8ed', borderRadius: '6px', padding: '2px', cursor: 'pointer' }} />
                <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#023047' }}>{style.bgColor}</span>
              </>
            )}
            <label style={{ fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input type="checkbox" checked={style.showLargeIcon} onChange={(e) => setStyle((p) => ({ ...p, showLargeIcon: e.target.checked }))} />
              Large icon on the Basic notification
            </label>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ ...LABEL, marginBottom: 0 }}>Icons ({icons.length} of 6)</label>
              <button
                onClick={addIcon}
                disabled={icons.length >= 6}
                style={{ background: icons.length >= 6 ? '#e1e8ed' : '#023047', color: icons.length >= 6 ? '#6a7c92' : '#fff', border: 'none', fontSize: '11px', padding: '5px 10px', borderRadius: '4px', cursor: icons.length >= 6 ? 'not-allowed' : 'pointer' }}
              >
                + Add icon
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {icons.map((ic, i) => (
                <div key={i} style={{ border: '1px solid #e1e8ed', borderRadius: '8px', padding: '12px', background: '#f8fafc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#023047' }}>Icon {i + 1}</span>
                    <button
                      onClick={() => removeIcon(i)}
                      disabled={icons.length <= 3}
                      style={{ background: 'none', border: 'none', color: icons.length <= 3 ? '#b8c2cc' : '#c1121f', fontSize: '11px', cursor: icons.length <= 3 ? 'not-allowed' : 'pointer', padding: 0 }}
                    >
                      Remove
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input placeholder="Image URL (https://)" value={ic.content} onChange={(e) => setIcon(i, { content: e.target.value })} style={MONO} />
                    <input placeholder="Screen reader label (optional)" value={ic.iat} onChange={(e) => setIcon(i, { iat: e.target.value })} style={FIELD} />

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <select value={ic.action} onChange={(e) => setIcon(i, { action: e.target.value, value: '' })} style={{ ...FIELD, flex: '1', minWidth: '150px' }}>
                        {ACTIONS.map((a) => <option key={a.name} value={a.name}>{a.label}</option>)}
                      </select>

                      {ic.action === 'navigate' && (
                        <select value={ic.navType} onChange={(e) => setIcon(i, { navType: e.target.value, value: '' })} style={{ ...FIELD, flex: '1', minWidth: '130px' }}>
                          <option value="deepLink">Deep link</option>
                          <option value="screenName">Screen name</option>
                          <option value="richLanding">Web page in app</option>
                        </select>
                      )}

                      {ic.action === 'track' && (
                        <select value={ic.trackType} onChange={(e) => setIcon(i, { trackType: e.target.value, value: '' })} style={{ ...FIELD, flex: '1', minWidth: '130px' }}>
                          <option value="event">Custom event</option>
                          <option value="userAttribute">User attribute</option>
                        </select>
                      )}
                    </div>

                    <input
                      placeholder={VALUE_HINT[ic.action === 'navigate' ? ic.navType : ic.action === 'track' ? ic.trackType : ic.action] || 'Value'}
                      value={ic.value}
                      onChange={(e) => setIcon(i, { value: e.target.value })}
                      style={MONO}
                    />

                    {ic.action === 'track' && (
                      <input placeholder="Recorded value (kvPairs.valueOf)" value={ic.valueOf} onChange={(e) => setIcon(i, { valueOf: e.target.value })} style={MONO} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ flex: '1', minWidth: '290px', background: '#f8fafc', padding: '20px', borderLeft: '1px solid #e1e8ed', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ ...LABEL, marginBottom: 0 }}>Value for moeFeatures</label>
              <button onClick={copy} style={{ background: '#023047', color: '#fff', border: 'none', fontSize: '11px', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <textarea
              readOnly
              value={json}
              rows={12}
              style={{ width: '100%', padding: '10px', border: '1px solid #e1e8ed', borderRadius: '6px', fontSize: '11px', fontFamily: 'monospace', lineHeight: '1.5', background: '#fff', color: '#023047', resize: 'vertical', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ background: '#fff', border: '1px solid #e1e8ed', borderRadius: '8px', padding: '12px', borderLeft: `4px solid ${heavy ? '#d46b08' : '#023047'}` }}>
            <div style={{ fontSize: '10px', color: '#6a7c92', textTransform: 'uppercase', marginBottom: '4px' }}>Payload size</div>
            <div style={{ fontSize: '18px', fontWeight: '800', fontFamily: 'monospace', color: heavy ? '#d46b08' : '#023047' }}>{bytes.toLocaleString()} bytes</div>
            <div style={{ fontSize: '11px', color: '#475569', lineHeight: '1.5', marginTop: '6px' }}>
              FCM rejects a push message above 4 KB, and this payload is only part of that message. Shorten your image URLs if the campaign approaches the limit.
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid #e1e8ed', borderRadius: '8px', padding: '12px', borderLeft: `4px solid ${issues.length ? '#c1121f' : '#2a9d8f'}` }}>
            <div style={{ fontSize: '10px', color: '#6a7c92', textTransform: 'uppercase', marginBottom: '6px' }}>
              {issues.length ? `${issues.length} item${issues.length > 1 ? 's' : ''} to fix` : 'Ready to paste'}
            </div>
            {issues.length ? (
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', color: '#475569', lineHeight: '1.7' }}>
                {issues.map((m, i) => <li key={i}>{m}</li>)}
              </ul>
            ) : (
              <div style={{ fontSize: '11px', color: '#475569', lineHeight: '1.5' }}>
                Every icon has an image URL and an action. Send a test campaign to a device running Android 12 or above before you launch.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconShortcutsPayloadBuilder;
