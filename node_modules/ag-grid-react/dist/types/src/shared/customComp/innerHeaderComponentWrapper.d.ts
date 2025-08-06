import type { IHeaderParams, IInnerHeaderComponent } from 'ag-grid-community';
import { CustomComponentWrapper } from './customComponentWrapper';
import type { CustomInnerHeaderProps } from './interfaces';
export declare class InnerHeaderComponentWrapper extends CustomComponentWrapper<IHeaderParams, CustomInnerHeaderProps, object> implements IInnerHeaderComponent {
    refresh(params: IHeaderParams): boolean;
}
