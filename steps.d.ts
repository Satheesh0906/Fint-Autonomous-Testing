/// <reference types='codeceptjs' />
type steps_file = typeof import('./steps_file.js');
type PlaywrightCustomHelper = import('./src/main/helpers/playwright_helper.js');
type ResembleHelper = import('codeceptjs-resemblehelper');

declare namespace CodeceptJS {
    interface SupportObject {
        I: I,
        current: any
    }

    interface Methods extends Playwright, AI, PlaywrightCustomHelper, ResembleHelper, REST, JSONResponse {
    }

    interface I extends ReturnType<steps_file>, WithTranslation<Methods> {
    }

    namespace Translation {
        interface Actions {
        }
    }
}
