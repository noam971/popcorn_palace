"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowtimeController = void 0;
const common_1 = require("@nestjs/common");
const dto_1 = require("./dto");
const showtime_service_1 = require("./showtime.service");
let ShowtimeController = class ShowtimeController {
    constructor(showtimesService) {
        this.showtimesService = showtimesService;
    }
    create(createShowtimeDto) {
        return this.showtimesService.create(createShowtimeDto);
    }
    findOne(id) {
        return this.showtimesService.findOne(id);
    }
    update(id, updateShowtimeDto) {
        return this.showtimesService.update(id, updateShowtimeDto);
    }
    remove(id) {
        return this.showtimesService.remove(id);
    }
};
exports.ShowtimeController = ShowtimeController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateShowtimeDto]),
    __metadata("design:returntype", void 0)
], ShowtimeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ShowtimeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateShowtimeDto]),
    __metadata("design:returntype", void 0)
], ShowtimeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ShowtimeController.prototype, "remove", null);
exports.ShowtimeController = ShowtimeController = __decorate([
    (0, common_1.Controller)('showtime'),
    __metadata("design:paramtypes", [showtime_service_1.ShowtimeService])
], ShowtimeController);
//# sourceMappingURL=showtime.controller.js.map