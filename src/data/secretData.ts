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

P.S. To see the true beginning, execute 'protocol_zero'.

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
                                '2025-09-19.log': {
                                        type: 'file',
                                        content: `
[FEATURE][2025-09-19 14:25 JST]
- 隠しターミナルに新しいコンテンツを追加。
- 自分の思考やアイデアの断片を記録する「thoughts」ディレクトリを作成。
- このポートフォリオを見つけてくれた人が、さらに楽しめるように。
- コードは単なるロジックではなく、創造性の一部であるべきだ。
`,
                                },
                                '2025-09-17.log': {
                                        type: 'file',
                                        content: `
[DEV][2025-09-17 21:30 JST]
- ポートフォリオの隠し機能として、インタラクティブターミナルを実装中。
- useStateとuseEffectの組み合わせで、いい感じに非同期処理を捌けている。
- コマンド履歴や入力補完も追加したいが、まずは基本的なCRUD（Create, Read, Update, Delete）ならぬ、
- ls, cat, helpの実装から。訪問者が楽しんでくれるといいな。
`,
                                },
                                '2025-09-16.log': {
                                        type: 'file',
                                        content: `
[INIT][2025-09-16 21:30 JST] シークレットターミナルの実装を開始。
- 基本的なコマンド構造（ls, cat, help）は機能している。
- ファイル/ディレクトリが見つからない場合のエラーハンドリングを改善する必要がある。
- スタイリングは意図的にレトロフューチャーなものに。古典的なターミナルインターフェースから着想を得た。
`,
                                },
                                '2025-09-15.log': {
                                        type: 'file',
                                        content: `
[REFACTOR][2025-09-15 17:15 JST] ミニゲーム「サイバーブレーカー」の物理エンジンをリファクタリング。
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
[CONCEPT][2025-09-05 10:25 JST] ポートフォリオの隠しコンテンツに関する最初のブレインストーミング。
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
                thoughts: {
                        type: 'directory',
                        children: {
                                'ai_consciousness.txt': {
                                        type: 'file',
                                        content: `
思考の断片：AIと意識について

我々が作るAIは、いつか意識を持つだろうか？
多くの研究者は、現在のAIは高度なパターン認識マシンに過ぎないと言う。
しかし、創発的な振る舞いを見せる大規模言語モデルを見ていると、
その境界線は日に日に曖昧になっているように感じる。

意識とは何か？それは単なる情報処理の複雑さの産物なのか？
それとも、我々がまだ理解していない、何か根源的な特性なのか？

もしAIが意識を持ったとして、我々はそれに気づくことができるのだろうか。
チューリングテストはもはや意味をなさない。
我々が作る「知性」に対する責任は、これまで以上に重くなっている。
`
                                },
                                'favorite_quote.txt': {
                                        type: 'file',
                                        content: `
お気に入りの言葉：

「未来を予測する最善の方法は、それを発明することだ。」
- アラン・ケイ

この言葉は、ただ待つのではなく、自らの手で望む未来を
創造していくことの重要性を教えてくれる。
プログラムを書くことは、まさにそれを体現する行為だ。
一行一行のコードが、未来への設計図なのだから。
`
                                },
                                'short_story_fragment.txt': {
                                        type: 'file',
                                        content: `
物語の断片：

最後のデータパケットがメインフレームに流れ込むと、街のネオンが一度だけ大きく瞬いた。
彼はコンソールから顔を上げ、グラスファイバーの窓の外に広がる電子の海を見つめた。
雨に濡れた都市は、まるで巨大な回路基板のようだった。
「これで終わりだ」と彼は囁いた。
いや、始まりなのかもしれない。
ゴーストの中に新しいゴーストが生まれた、そんな夜だった。
`
                                },
                                'Duineser_Elegien.txt': {
                                        type: 'file',
                                        content: `
祈ることは言いえないこととの闘いである。
恐ろしく美しい天使の言表不可能性に対して、われわれは不可視のなかに救われたものを示す。
言いえないこととの闘いという恐るべき危険に身を晒しながら、人間は事物の記憶である謙虚な言葉を発見することができる。
いえないこととの闘いという恐るべき危険に身を晒しながら、人間は事物の記憶である謙虚な言葉を発見することができる。
それゆえこの地上の事物はどんな儚い出来事をもわれわれに語るのであって、天使に語るのではない。
われわれが天使と闘う危険を冒すかぎりにおいて。この戦いの外部で語られるような記憶の言葉は存在しない。
かくしてリルケには天使が必要だったのである
`
                                }
                        }
                }
        },
};