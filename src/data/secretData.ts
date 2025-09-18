// ... existing code ...
// ターミナルに表示するデータ
// ここの内容を自由に変更して、あなただけの隠しコンテンツを作成できます。

// Define the structure for files and directories
export type FileSystemNode = File | Directory;

export interface File {
        type: 'file';
        isProtected?: boolean;
        password?: string;
        content: string;
        unlockEffect?: 'matrix';
}

export interface Directory {
        type: 'directory';
        children: { [key: string]: FileSystemNode };
}

export const fileSystem: Directory = {
        type: 'directory',
        children: {
                'about_me.txt': {
                        type: 'file',
                        content: `
Haruta Tsukada - フルスタック開発者

- 専門分野: React, Next.js, TypeScript, Node.js, Python
- 興味分野: AI/ML, WebGL, 分散型システム, UI/UXデザイン
- 使命: テクノロジーの限界を押し広げる、革新的でユーザー中心のアプリケーションを構築すること。
`,
                },
                'project_zero.log': {
                        type: 'file',
                        isProtected: true,
                        password: 'REBOOT', // The password for the file
                        unlockEffect: 'matrix',
                        content: `
[CLASSIFIED] MEMORANDUM

Subject: Project Zero - "The Genesis Code"

This project represents the foundational code from which my passion for development was born.
It's a simple text-based adventure game written in QBasic, full of spaghetti code and youthful ambition.
It reminds me that every complex system starts with a single line of code.

Thank you for taking the time to uncover this piece of my history.
Your curiosity and persistence are the marks of a true developer.

- Haruta Tsukada
      `,
                },
                unreleased_projects: {
                        type: 'directory',
                        children: {
                                'Project_Orion.txt': {
                                        type: 'file',
                                        content: `
プロジェクト名: Project Orion
ステータス: 保留中
概要: Three.jsとWebSocketで構築された、Web向けのリアルタイム共同3Dモデリングツール。
特徴:
  - 複数ユーザーによるリアルタイム編集
  - バージョン履歴とロールバック機能
  - GLTFモデルのインポート/エクスポート
保留理由: リアルタイム同期における状態管理の複雑性が高い。CRDTsに関するさらなる研究が必要。
`,
                                },
                                'Project_Aether.txt': {
                                        type: 'file',
                                        content: `
プロジェクト名: Project Aether
ステータス: 開発中 (アルファ版)
概要: ユーザーがノードベースのインターフェースを通じてGLSLシェーダーを組み合わせ、操作することで、複雑なビジュアルを創造できるジェネレーティブアート・プラットフォーム。
技術スタック: React, Three.js (WebGL), 状態管理にZustand
目標: プログラマーでなくてもシェーダーアートをより身近なものにし、作品を共有するコミュニティを創造すること。
`,
                                },
                                'Project_Chrono.txt': {
                                        type: 'file',
                                        content: `
プロジェクト名: Project Chrono
ステータス: 構想段階
概要: 分散型ソーシャルメディアアプリケーションのプロトタイプ。データストレージとユーザー認証にP2Pネットワークとブロックチェーンの活用を模索。
中心的なアイデア:
  - ユーザーデータの主権（中央サーバーの不在）
  - コミュニティの合意によるコンテンツモデレーション
  - 従来の広告ベースの収益モデルに代わる選択肢の探求
課題: P2Pネットワークのスケーラビリティ、分散型システムのUXデザイン。
`,
                                },
                        },
                },
                dev_logs: {
                        type: 'directory',
                        children: {
                                '2025-09-17.log': {
                                        type: 'file',
                                        content: `
[DEV][2025-09-15 21:30 JST]
- ポートフォリオの隠し機能として、インタラクティブターミナルを実装中。
- useStateとuseEffectの組み合わせで、いい感じに非同期処理を捌けている。
- コマンド履歴や入力補完も追加したいが、まずは基本的なCRUD（Create, Read, Update, Delete）ならぬ、
- ls, cat, helpの実装から。訪問者が楽しんでくれるといいな。
`,
                                },
                                '2025-09-16.log': {
                                        type: 'file',
                                        content: `
[INIT][2025-09-17 21:30 JST] シークレットターミナルの実装を開始。
- 基本的なコマンド構造（ls, cat, help）は機能している。
- ファイル/ディレクトリが見つからない場合のエラーハンドリングを改善する必要がある。
- スタイリングは意図的にレトロフューチャーなものに。古典的なターミナルインターフェースから着想を得た。
`,
                                },
                                '2025-09-15.log': {
                                        type: 'file',
                                        content: `
[REFACTOR][2025-09-17 17:15 JST] ミニゲーム「サイバーブレーカー」の物理エンジンをリファクタリング。
- より正確な衝突検出アルゴリズムを実装。
- パドルとボールの相互作用が格段に自然になった。
- ボールが破壊不能なブロックにスタックするバグを修正。
`,
                                },
                                '2025-09-10.log': {
                                        type: 'file',
                                        content: `
[3D][2025-09-10 16:43 JST] 「About Me」セクションのメイン3Dオブジェクトに新しいGLTFローダーを統合。
- これにより、将来的により複雑なモデルを扱えるようになった。
- モバイルデバイスでのシェーダーの問題のデバッグにかなりの時間を費した。原因はfloatの精度問題だった。
- ブルームとグリッチのポストプロセッシングエフェクトをスクロール進行度と連動させ、よりダイナミックな印象に。
`,
                                },
                                '2025-09-05.log': {
                                        type: 'file',
                                        content: `
[CONCEPT][2025-09-04 10:25 JST] ポートフォリオの隠しコンテンツに関する最初のブレインストーミング。
- 単純な隠しページは見送ることに。インタラクティブな要素の方がエンゲージメントが高いと判断。
- シークレットターミナルのアイデアが浮上。サイバーパンク/ハッカーの美学に合致し、「語るな、見せろ」というアプローチを可能にする。
- ユーザーはミニゲームをクリアして「資格」を証明する必要がある。これにより、楽しい参入障壁が生まれる。
`,
                                },
                                '2025-09-02.log': {
                                        type: 'file',
                                        content: `
[2025-09-02 17:15 JST]
- WebAssemblyの学習を開始。Rustで書いたコードをブラウザで直接実行できるのは革命的だ。
- パフォーマンスが求められる画像処理や物理演算をフロントエンドに持ってくることで、
- これまで不可能だったWebアプリケーションが実現できるかもしれない。
- まずは簡単な図形描画ライブラリのコンパイルから試してみよう。
`,
                                },
                        },
                },
        },
};