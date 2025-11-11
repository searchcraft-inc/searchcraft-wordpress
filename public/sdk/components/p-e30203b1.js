/**
 * This is the default instance id for searchcraft core instances.
 * When no id is specified in a component's props, use this one.
 */
const DEFAULT_CORE_INSTANCE_ID = 'searchcraft';
/**
 * CoreInstanceRegistry
 *
 * This class is responsible for managing all of the instances of SearchcraftCore on a page.
 * It provides a means for consuming components to use the instance of SearchcraftCore that
 * they need to use when that instance of core gets added to the Registry.
 */
class CoreInstanceRegistry {
    coreInstances = {};
    subscriptions = {};
    /**
     * Adds a SearchcraftCore instance to the Registry.
     *
     * When the instance is added, iterates through the onAvailable callbacks
     * that have been subscribed via useCoreInstance.
     *
     * @param coreInstance The SearchcraftCore instance to add to the registry
     * @param searchcraftId The unique identifier for this SearchcraftCore instance.
     */
    addCoreInstance(coreInstance, searchcraftId) {
        const id = searchcraftId || DEFAULT_CORE_INSTANCE_ID;
        this.coreInstances[id] = coreInstance;
        for (const callback of this.subscriptions[id] || []) {
            callback(coreInstance);
        }
    }
    /**
     * Use the specified instance of SearchcraftCore. When the instance becomes available,
     * the onAvailable callback will be called.
     *
     * @param searchcraftId The SearchcraftCore instance to use.
     * @param onAvailable The callback that gets called when the core instance becomes available.
     */
    useCoreInstance(searchcraftId, onAvailable) {
        const id = searchcraftId || DEFAULT_CORE_INSTANCE_ID;
        // If the core instance already is available, call the onAvailable callback immediately.
        if (this.coreInstances[id]) {
            onAvailable(this.coreInstances[id]);
            return () => { };
        }
        // Add the callback to the collection of callbacks for this searchcraft instance.
        if (!this.subscriptions[id]) {
            this.subscriptions[id] = [];
        }
        this.subscriptions[id].push(onAvailable);
        return () => {
            if (this.subscriptions[id]) {
                this.subscriptions[id] = this.subscriptions[id].filter((cb) => cb !== onAvailable);
            }
        };
    }
}
const registry = new CoreInstanceRegistry();

export { DEFAULT_CORE_INSTANCE_ID as D, registry as r };

//# sourceMappingURL=p-e30203b1.js.map