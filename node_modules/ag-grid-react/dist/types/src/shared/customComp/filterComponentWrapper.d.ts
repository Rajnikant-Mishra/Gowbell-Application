import type { IAfterGuiAttachedParams, IDoesFilterPassParams, IFilter, IFilterParams } from 'ag-grid-community';
import { AgPromise } from 'ag-grid-community';
import { CustomComponentWrapper } from './customComponentWrapper';
import type { CustomFilterCallbacks, CustomFilterProps } from './interfaces';
export declare class FilterComponentWrapper extends CustomComponentWrapper<IFilterParams, CustomFilterProps, CustomFilterCallbacks> implements IFilter {
    private model;
    private readonly onModelChange;
    private readonly onUiChange;
    private expectingNewMethods;
    private hasBeenActive;
    private resolveSetMethodsCallback;
    private awaitSetMethodsCallback;
    isFilterActive(): boolean;
    doesFilterPass(params: IDoesFilterPassParams<any>): boolean;
    getModel(): any;
    setModel(model: any): AgPromise<void>;
    refresh(newParams: IFilterParams): boolean;
    afterGuiAttached(params?: IAfterGuiAttachedParams): void;
    protected getOptionalMethods(): string[];
    protected setMethods(methods: CustomFilterCallbacks): void;
    private updateModel;
    protected getProps(): CustomFilterProps;
}
