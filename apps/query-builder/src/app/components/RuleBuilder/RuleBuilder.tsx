import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { FieldValueType } from '@raise-clp/models';
import { QueryBuilderDnD } from '@react-querybuilder/dnd';
import { QueryBuilderMaterial } from '@react-querybuilder/material';
import { prop as _prop } from 'lodash/fp';
import { useCallback, useEffect, useState } from 'react';
import {
    Field,
    JsonLogicRulesLogic,
    QueryBuilder,
    RuleGroupType,
    RuleValidator,
    ValidationResult,
    formatQuery,
    parseJsonLogic
} from 'react-querybuilder';
import 'react-querybuilder/dist/query-builder.scss';
import { SelectedItem } from '../../model/view.model';
import './RuleBuilder.scss';

export interface FieldWithType extends Field {
    questionType: FieldValueType;
}

interface RuleBuilderProps {
    chapterId: number | undefined;
    unitId: number | undefined;
    rule: JsonLogicRulesLogic | any;
    fields: FieldWithType[] | undefined;

    saveHandler: (selectedItem: SelectedItem, shouldSkip: boolean) => void;
}

export const validatorFactory = (field: Field) => {
    switch (field.fieldType) {
        case FieldValueType.boolean:
            return yesNoValidator;
        case FieldValueType.number:
            return numberValidator;
        default:
            return defaultValidator;
    }
};

export const defaultValidator: RuleValidator = (rule): ValidationResult => {
    return {
        valid: rule.value !== undefined && rule.value !== null && typeof rule.value == 'string',
        reasons: ['Field has no value']
    };
};

export const numberValidator: RuleValidator = (rule): ValidationResult => {
    return {
        valid: rule.value !== undefined && rule.value !== null && typeof rule.value == 'number',
        reasons: ['Field has no value']
    };
};

export const yesNoValidator: RuleValidator = (rule): ValidationResult => {
    return {
        valid: rule.value !== undefined && rule.value !== null && typeof rule.value == 'boolean',
        reasons: ['Field value has invalid type']
    };
};

export const addValidators = (fields: Field[] | undefined) =>
    fields?.map((field) => ({
        ...field,
        validator: validatorFactory(field)
    }));

const RuleBuilder = (props: RuleBuilderProps) => {
    const [chapterId, setChapterId] = useState<number | undefined>(props.chapterId);
    const [unitId, setUnitId] = useState<number | undefined>(props.unitId);
    const [rule, setRule] = useState<RuleGroupType>(parseJsonLogic(props.rule ?? {}));
    const [fields, setFields] = useState(addValidators(props.fields));
    const handleQueryChange = useCallback(
        (change: RuleGroupType) => {
            setRule(change);
            const rule = formatQuery(change, 'jsonlogic') || ({} as any);
            const newGroup = change.rules.find(_prop('combinator')) as RuleGroupType;
            const isNewGroup: boolean = newGroup && newGroup?.rules.length < 2;

            if (!chapterId) return;

            props.saveHandler(
                {
                    chapterId,
                    unitId,
                    selectedDto: undefined,
                    rule
                },
                !!isNewGroup
            );
        },
        [chapterId, props, unitId]
    );

    useEffect(() => {
        setChapterId(props.chapterId);
        setUnitId(props.unitId);
        setRule(parseJsonLogic(props.rule));
        setFields(addValidators(props.fields));
    }, [props.chapterId, props.unitId, props.rule, props.fields]);

    return fields ? (
        <div>
            <h2>Build your Query</h2>
            <QueryBuilderDnD>
                <QueryBuilderMaterial>
                    <QueryBuilder
                        key={`${chapterId}_${unitId ?? 0}`}
                        fields={fields}
                        query={rule}
                        onQueryChange={handleQueryChange}
                        addRuleToNewGroups
                    />
                </QueryBuilderMaterial>
            </QueryBuilderDnD>

            <Accordion className="logic">
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    JSON logic (<i>for development purposes only</i>)
                </AccordionSummary>
                <AccordionDetails>
                    <code>
                        <pre>{JSON.stringify(formatQuery(rule, 'jsonlogic'), null, 2)}</pre>
                    </code>
                </AccordionDetails>
            </Accordion>
        </div>
    ) : (
        <div>Loading...</div>
    );
};

export default RuleBuilder;
