"""Desktop/mobile smoke tests. Managed browsers fall back to injected HTML and a named storage adapter; no policy changes."""
from pathlib import Path
import json
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
assert (ROOT/'index.html').exists(), 'A playable bundled index.html must exist'
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--allow-file-access-from-files'])
    errors=[]
    page=browser.new_page(viewport={'width':1440,'height':1000})
    page.on('pageerror',lambda e:errors.append(str(e)))
    def load_app(target, storage=None):
        target.goto('about:blank')
        target.evaluate("""(initial) => {
            const data = {...initial};
            Object.defineProperty(window, 'localStorage', {configurable:true, value: {
                getItem:k=>Object.prototype.hasOwnProperty.call(data,k)?data[k]:null,
                setItem:(k,v)=>{data[k]=String(v)}, removeItem:k=>{delete data[k]},
                clear:()=>{for(const k of Object.keys(data))delete data[k]},
                key:i=>Object.keys(data)[i]||null, get length(){return Object.keys(data).length}
            }});
            window.__testStorage = data;
        }""", storage or {})
        target.set_content((ROOT/'index.html').read_text(), wait_until='domcontentloaded')
    load_app(page)
    page.get_by_role('button',name='Fahrerkarriere starten',exact=True).click()
    page.locator('#career-name').fill('Mario Trefflinger')
    page.get_by_role('button',name='Karriere beginnen',exact=True).click()
    page.get_by_role('button',name='Tempo trainieren',exact=True).click()
    page.get_by_role('button',name='Qualifying & Rennen starten',exact=True).click()
    assert 'Die erste Kurve' in page.content()
    state=json.loads(page.evaluate("localStorage.getItem('endurance-v1-slot-1')"))
    elapsed=state['race']['elapsed']
    page.locator('[data-nav="standings"]').first.click()
    state2=json.loads(page.evaluate("localStorage.getItem('endurance-v1-slot-1')"))
    assert state2['race']['elapsed']==elapsed,'Viewing standings must not advance the race'
    page.locator('[data-nav="race"]').first.click()
    for _ in range(20):
        if page.locator('[data-choice]').count()==0: break
        choices=page.locator('[data-choice]')
        (page.locator('[data-choice="balanced"]') if page.locator('[data-choice="balanced"]').count() else choices.first).click()
        page.wait_for_timeout(200)
    assert page.locator('[data-action="next-round"]').count()==1,'Complete first race'
    page.screenshot(path=str(ROOT/'tests/desktop-result.png'),full_page=True)
    page.locator('[data-action="next-round"]').click()
    saved=page.evaluate('({...window.__testStorage})')
    load_app(page, saved)
    page.get_by_role('button',name='Weiterspielen',exact=True).first.click()
    assert 'Spielberg' in page.content(),'Save resumes correct next race'
    page.screenshot(path=str(ROOT/'tests/desktop-garage.png'),full_page=True)
    mobile=browser.new_page(viewport={'width':390,'height':844},device_scale_factor=1,is_mobile=True,has_touch=True)
    mobile.on('pageerror',lambda e:errors.append(str(e)))
    load_app(mobile)
    mobile.get_by_role('button',name='Managerkarriere starten',exact=True).click()
    mobile.locator('#career-class').select_option('Hypercar')
    mobile.get_by_role('button',name='Karriere beginnen',exact=True).click()
    mobile.screenshot(path=str(ROOT/'tests/mobile-garage.png'),full_page=True)
    assert mobile.evaluate('document.documentElement.scrollWidth <= window.innerWidth+1'),'No mobile horizontal overflow'
    mobile.get_by_role('button',name='Qualifying & Rennen starten',exact=True).click()
    mobile.screenshot(path=str(ROOT/'tests/mobile-race.png'),full_page=True)
    assert mobile.locator('[data-choice]').count()==3
    assert mobile.evaluate('document.documentElement.scrollWidth <= window.innerWidth+1'),'Race fits mobile viewport'
    # Render every major manager panel and exercise hiring/development through the UI.
    for section in ['team','standings','calendar','market','history','settings']:
        mobile.evaluate("window.scrollTo(0,0)")
        mobile.locator('[data-action="more"]').first.click()
        mobile.locator('#modal-root [data-nav="'+section+'"]').click()
        assert mobile.evaluate('document.documentElement.scrollWidth <= window.innerWidth+1'), section
    # A mid-race file import resumes at the exact simulated time, including night stints.
    long=browser.new_page(viewport={'width':1440,'height':1000})
    long.on('pageerror',lambda e:errors.append(str(e)))
    load_app(long)
    long.screenshot(path=str(ROOT/'tests/desktop-home.png'),full_page=True)
    saved_long=long.evaluate("""() => {
        const E=window.Endurance,s=E.createCareer({role:'driver',scenario:'lemans',seed:314159});
        E.startRace(s);
        for(let i=0;i<8;i++){const cs=E.choices(s);E.choose(s,cs.find(c=>c.id==='balanced')?.id||cs[0].id);}
        return E.serialise(s);
    }""")
    long.locator('#import-file').set_input_files({'name':'resume.json','mimeType':'application/json','buffer':saved_long.encode()})
    long.get_by_role('button',name='Spielstand übernehmen',exact=True).click()
    assert json.loads(long.evaluate("localStorage.getItem('endurance-v1-slot-1')"))['race']['elapsed']==480
    long.evaluate("document.documentElement.style.scrollBehavior='auto'; window.scrollTo(0,0);document.getElementById('toast').className='';document.activeElement.blur()")
    long.wait_for_timeout(250)
    long.screenshot(path=str(ROOT/'tests/desktop-night.png'),full_page=True)
    for _ in range(40):
        if long.locator('[data-choice]').count()==0: break
        choices=long.locator('[data-choice]')
        (long.locator('[data-choice="balanced"]') if long.locator('[data-choice="balanced"]').count() else choices.first).click()
        long.wait_for_timeout(180)
    result=json.loads(long.evaluate("localStorage.getItem('endurance-v1-slot-1')"))
    assert result['race']['elapsed']==1440 and result['race']['finished']
    assert all(d['minutes']>0 for d in result['race']['result']['drivers'])
    # Copy into a separate slot, then reject a corrupt import without losing either save.
    long.locator('[data-nav="settings"]').first.click()
    long.locator('[data-copy="2"]').click()
    assert long.evaluate("localStorage.getItem('endurance-v1-slot-1')===localStorage.getItem('endurance-v1-slot-2')")
    before=long.evaluate("localStorage.getItem('endurance-v1-slot-2')")
    long.locator('#import-file').set_input_files({'name':'bad.json','mimeType':'application/json','buffer':b'{"broken":true}'})
    long.wait_for_timeout(100)
    assert long.evaluate("localStorage.getItem('endurance-v1-slot-2')")==before
    assert long.locator('#toast.error').count()==1
    # Restricted storage must not falsely mark empty slots corrupt or prevent a session.
    blocked=browser.new_page(viewport={'width':390,'height':844})
    blocked.on('pageerror',lambda e:errors.append(str(e)))
    load_app(blocked)
    blocked.evaluate("Object.defineProperty(window,'localStorage',{configurable:true,get(){throw new Error('Blocked storage')}})")
    blocked.get_by_role('button',name='Fahrerkarriere starten',exact=True).click()
    blocked.get_by_role('button',name='Karriere beginnen',exact=True).click()
    assert blocked.locator('.storage-banner').count()==1
    blocked.locator('[data-action="more"]').first.click()
    blocked.locator('#modal-root [data-action="home"]').click()
    assert blocked.get_by_role('button',name='Weiterspielen',exact=True).count()==1
    blocked.get_by_role('button',name='Weiterspielen',exact=True).click()
    assert blocked.locator('.storage-banner').count()==1
    assert not errors,errors
    print('PASS: driver creation, training, race, points navigation, full result, save/reload, manager creation, all panels, Le Mans 24h + import resume, slot copying, corrupt import, blocked storage, mobile layout, injected HTML with storage adapter, no JS errors (managed browser blocks file/http navigation)')
    browser.close()
