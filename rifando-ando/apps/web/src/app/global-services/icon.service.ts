import { Injectable, Input } from "@angular/core";
import { ChevronDown, LucideIconData, Settings, PencilLine, ChevronLeft, Calendar, WalletMinimal, User } from "lucide-angular";

@Injectable({
    providedIn: 'root'
})
export class IconService {
    iconName: string;

    public iconsMap: Record<string, LucideIconData> = {
        'chevronLeft': ChevronLeft,
        'settings': Settings,
        'pencilLine': PencilLine,
        'calendar': Calendar,
        'walletMinimal': WalletMinimal,
        'user': User
    };

    get icon() {
        return this.iconsMap[this.iconName];
    }
}