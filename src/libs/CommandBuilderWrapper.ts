const CommandBuilder = Packages.xyz.wagyourtail.jsmacros.client.api.classes.inventory.CommandBuilder;
const BlockPosHelper = Packages.xyz.wagyourtail.jsmacros.client.api.helpers.world.BlockPosHelper;

type Command = {
    literalArg?: string;
    booleanArg?: string;
    intArg?: string | { name: string; min: int; max: int };
    intRangeArg?: string;
    longArg?: string | { name: string; min: long; max: long };
    floatRangeArg?: string;
    doubleArg?: string | { name: string; min: double; max: double };
    uuidArgType?: string;
    greedyStringArg?: string;
    quotedStringArg?: string;
    wordArg?: string;
    regexArgType?: {
        name: string;
        regex: string;
        flags: string;
    };
    textArgType?: string;
    timeArg?: string;
    identifierArg?: string;
    nbtArg?: string;
    nbtElementArg?: string;
    nbtCompoundArg?: string;
    colorArg?: string;
    angleArg?: string;
    itemArg?: string;
    itemStackArg?: string;
    itemPredicateArg?: string;
    blockArg?: string;
    blockStateArg?: string;
    blockPredicateArg?: string;
    blockPosArg?: string;
    columnPosArg?: string;
    dimensionArg?: string;
    itemSlotArg?: string;
    particleArg?: string;

    executes?: (contextHelper: CommandContextHelper) => void;
    suggest?: (contextHelper: CommandContextHelper, suggestionHelper: SuggestionsBuilderHelper) => void;
    suggestMatching?: string[];
    suggestIdentifier?: string[];
    suggestBlockPositions?: BlockPosHelper[];

    children?: Command[];
};

class CommandBuilderWrapper {
    private builder: CommandBuilder;
    constructor(commandName: string) {
        this.builder = Chat.getCommandManager().createCommandBuilder(commandName);
    }

    processCommands(commands: Command[]) {
        for (const command of commands) {
            this.processCommand(command);
        }
    }

    processCommand(command: Command) {
        const applyArgs = (node: Command, builder: CommandBuilder): CommandBuilder => {
            if (node.literalArg) builder = builder.literalArg(node.literalArg);
            if (node.booleanArg) builder = builder.booleanArg(node.booleanArg);

            if (node.intArg) {
                if (typeof node.intArg === 'string') {
                    builder = builder.intArg(node.intArg);
                } else {
                    builder = builder.intArg(node.intArg.name, node.intArg.min, node.intArg.max);
                }
            }

            if (node.intRangeArg) builder = builder.intRangeArg(node.intRangeArg);
            if (node.longArg) {
                if (typeof node.longArg === 'string') {
                    builder = builder.longArg(node.longArg);
                } else {
                    builder = builder.longArg(node.longArg.name, node.longArg.min, node.longArg.max);
                }
            }
            if (node.floatRangeArg) builder = builder.floatRangeArg(node.floatRangeArg);
            if (node.doubleArg) {
                if (typeof node.doubleArg === 'string') {
                    builder = builder.doubleArg(node.doubleArg);
                } else {
                    builder = builder.doubleArg(node.doubleArg.name, node.doubleArg.min, node.doubleArg.max);
                }
            }
            if (node.uuidArgType) builder = builder.uuidArgType(node.uuidArgType);
            if (node.greedyStringArg) builder = builder.greedyStringArg(node.greedyStringArg);
            if (node.quotedStringArg) builder = builder.quotedStringArg(node.quotedStringArg);
            if (node.wordArg) builder = builder.wordArg(node.wordArg);

            if (node.regexArgType) {
                const { name, regex, flags } = node.regexArgType;
                builder = builder.regexArgType(name, regex, flags);
            }

            if (node.textArgType) builder = builder.textArgType(node.textArgType);
            if (node.timeArg) builder = builder.timeArg(node.timeArg);
            if (node.identifierArg) builder = builder.identifierArg(node.identifierArg);
            if (node.nbtArg) builder = builder.nbtArg(node.nbtArg);
            if (node.nbtElementArg) builder = builder.nbtElementArg(node.nbtElementArg);
            if (node.nbtCompoundArg) builder = builder.nbtCompoundArg(node.nbtCompoundArg);
            if (node.colorArg) builder = builder.colorArg(node.colorArg);
            if (node.angleArg) builder = builder.angleArg(node.angleArg);
            if (node.itemArg) builder = builder.itemArg(node.itemArg);
            if (node.itemStackArg) builder = builder.itemStackArg(node.itemStackArg);
            if (node.itemPredicateArg) builder = builder.itemPredicateArg(node.itemPredicateArg);
            if (node.blockArg) builder = builder.blockArg(node.blockArg);
            if (node.blockStateArg) builder = builder.blockStateArg(node.blockStateArg);
            if (node.blockPredicateArg) builder = builder.blockPredicateArg(node.blockPredicateArg);
            if (node.blockPosArg) builder = builder.blockPosArg(node.blockPosArg);
            if (node.columnPosArg) builder = builder.columnPosArg(node.columnPosArg);
            if (node.dimensionArg) builder = builder.dimensionArg(node.dimensionArg);
            if (node.itemSlotArg) builder = builder.itemSlotArg(node.itemSlotArg);
            if (node.particleArg) builder = builder.particleArg(node.particleArg);

            if (node.suggestMatching && node.suggestMatching.length > 0) {
                builder = builder.suggestMatching(node.suggestMatching);
            }

            if (node.suggestIdentifier && node.suggestIdentifier.length > 0) {
                builder = builder.suggestIdentifier(node.suggestIdentifier);
            }

            if (node.suggestBlockPositions && node.suggestBlockPositions.length > 0) {
                builder = builder.suggestBlockPositions(node.suggestBlockPositions);
            }

            if (node.executes) {
                builder = builder.executes(JavaWrapper.methodToJava(node.executes));
            }

            if (node.suggest) {
                builder = builder.suggest(JavaWrapper.methodToJava(node.suggest));
            }

            if (node.children && Array.isArray(node.children)) {
                node.children.forEach((child) => {
                    builder = applyArgs(child, builder);
                });
            }

            builder = builder.or();
            return builder;
        };

        this.builder = applyArgs(command, this.builder);
        return this.builder;
    }

    register() {
        this.builder.register();
    }

    unregister() {
        this.builder.unregister();
    }
}

export default CommandBuilderWrapper;
