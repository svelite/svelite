function matchRoute(url, pages) {
    console.log(url, pages.map(x => ([x.slug, x.modules[0]?.name])));
    const staticPages = pages.filter(x => !x.slug.includes('{'));
    const dynamicPages = pages.filter(x => x.slug.includes('{') && !x.slug.includes('{...'));
    const restPages = pages.filter(x => x.slug.includes('{...'));
    console.log(url, pages.map(x => ([x.slug, x.modules[0]?.name])));
    let result = {};
    for (let page of staticPages) {
        if (url === page.slug)
            result = {
                page,
                params: {}
            };
    }
    if (result.page)
        return result;
    for (let page of dynamicPages) {
        console.log('match dynamic', page);
        const urlSplitted = url.split('/');
        const slugSplitted = page.slug?.split('/');
        // match dynamic..
        //
        if (!urlSplitted.length === slugSplitted)
            result = {};
        let params = {};
        for (let index in slugSplitted) {
            console.log('check slug part: ', urlSplitted[index], slugSplitted[index]);
            if (urlSplitted[index] === slugSplitted[index])
                continue;
            // check if slugSplitted is dynamic
            if (slugSplitted[index].startsWith('{')) {
                console.log('has dynamic');
                result.page = page;
                params[slugSplitted[index].slice(1, slugSplitted[index].length - 1)] = urlSplitted[index];
                result.params = params;
                break;
            }
            else {
                break;
            }
        }
    }
    if (result.page)
        return result;
    for (let page of restPages) {
        const urlSplitted = url.split('/');
        const slugSplitted = page.slug?.split('/');
        // match dynamic..
        //
        if (!urlSplitted.length === slugSplitted)
            result = {};
        let params = {};
        for (let index in slugSplitted) {
            if (urlSplitted[index] !== slugSplitted[index]) {
                // check if slugSplitted is dynamic
                if (slugSplitted[index]?.startsWith('{...')) {
                    result.page = page;
                    params[slugSplitted[index].slice(4, slugSplitted[index].length - 1)] = urlSplitted
                        .slice(index)
                        .join('/');
                    result.params = params;
                    break;
                }
            }
            else {
                continue;
            }
        }
        // if (result.page) return result;
    }
    console.log(result);
    return result;
}
export function createSveliteLoad(api, pages, modules, layouts) {
    return async (slug) => {
        const route = matchRoute(slug, pages);
        if (!route.page)
            return {};
        const { page, params } = route;
        // layout
        if (page.layout) {
            // layout component
            page.layout.component = layouts[page.layout.name].component;
            // layout load
            if (layouts[page.layout.name].load) {
                page.layout.props ??= {};
                page.layout.props.data = await layouts[page.layout.name].load(page.layout.props, api, params);
            }
        }
        // Page (recursive)
        async function initializeModule(module) {
            // page component
            module.component = modules[module.name].component;
            // page load
            if (modules[module.name].load) {
                module.props.data = await modules[module.name].load(module.props, api, params);
            }
            // initialize all modules of page recursively
            for (let key in module.props) {
                let prop = module.props[key];
                if (Array.isArray(prop) &&
                    prop.length > 0 &&
                    typeof prop[0].props === 'object' &&
                    modules[prop[0].name]) {
                    for (let slot of prop) {
                        await initializeModule(slot);
                    }
                }
            }
        }
        // call initialize module for all modules of page
        for (let module of page.modules) {
            await initializeModule(module);
        }
        return {
            page,
            modules
        };
    };
}
