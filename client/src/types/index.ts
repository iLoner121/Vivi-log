// 蛇类爬宠基本信息
export interface Snake {
  id: number;
  name: string;           // 昵称
  code: string;           // 编号
  species: string;        // 物种
  gene: string;          // 基因
  gender: 'male' | 'female';  // 性别
  birthDate: string;     // 出生日期
  source?: string;       // 来源信息
  price?: number;        // 价格
  notes?: string;        // 备注
  color?: string;        // 颜色
  pattern?: string;      // 花纹特征
  imageUrl?: string;     // 图片URL
  createdAt: string;     // 创建时间
  updatedAt: string;     // 更新时间
}

// 喂食记录
export interface Feeding {
  id: number;
  snakeId: number;       // 关联的蛇ID
  date: string;          // 喂食日期
  foodType: string;      // 食物类型
  foodWeight: number;    // 食物重量
  snakeWeight: number;   // 蛇的体重
  notes?: string;        // 备注
  createdAt: string;     // 创建时间
  updatedAt: string;     // 更新时间
}

// 蜕皮记录
export interface Shedding {
  id: number;
  snakeId: number;       // 关联的蛇ID
  date: string;          // 蜕皮日期
  completeness: number;  // 蜕皮完整度（1-100）
  notes?: string;        // 备注
  createdAt: string;     // 创建时间
  updatedAt: string;     // 更新时间
}

// 繁殖记录
export interface Breeding {
  id: number;
  maleSnakeId: number;   // 公蛇ID
  femaleSnakeId: number; // 母蛇ID
  date: string;          // 配种日期
  result: string;        // 配种结果
  eggsCount?: number;    // 产卵数量
  hatchCount?: number;   // 孵化数量
  notes?: string;        // 备注
  createdAt: string;     // 创建时间
  updatedAt: string;     // 更新时间
} 